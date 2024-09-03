const Category = require("../Models/Category");
const Product = require("../Models/Product");

const { validationResult } = require("express-validator");
const { uploadOnCloudinary } = require("../Services/Cloudnary");
class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filtering() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit"];
    excludedFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt|regex)\b/g,
      (match) => `$${match}`
    );

    this.query.find(JSON.parse(queryStr));
    return this;
  }

  sorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  pagination() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 9;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

async function handleGetProduct(req, res) {
  try {
    const features = new APIFeatures(Product.find(), req.query)
      .filtering()
      // .sorting()
      // .pagination();
    const products = await features.query;
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
}

async function handleCreateProduct(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { title, price, description, imagePath, category } =
      req.body;
      
    let cat = await Category.findOne({ name: category });

    if (!cat) {
      return res.status(400).json({ msg: "Category does not exists" });
    }
    const image = await uploadOnCloudinary(req.file.path);
    const newproduct = await Product.create({
      title: title,
      price,
      description,
      image,
      category: cat.id,
    });
    return res.status(200).json({ msg: "Product Added", newproduct });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
}

async function handleDeleteProduct(req, res) {
  try {
    const productID = req.params.id;
    const product = await Product.findById(productID);
    deleteOnCloudinary(product.image.public_id);
    await Product.findByIdAndDelete(productID);
    return res.json({ msg: "deleted successfully" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
}
async function handleUpdateProduct(req, res) {
  try {
    return res.json({ msg: "put" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
}
async function handleSearch (req, res) {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Query parameter is required' });
    }

    // Search products by title (you can expand this to search by other fields)
    const products = await Product.find({
      title: { $regex: query, $options: 'i' },
    }).limit(10); // Limit the number of suggestions

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  handleGetProduct,
  handleCreateProduct,
  handleDeleteProduct,
  handleUpdateProduct,
  handleSearch
};
