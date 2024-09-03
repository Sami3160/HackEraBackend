const { validationResult } = require("express-validator");
const User = require("../Models/User");
const { setUser } = require("../Services/Auth");
const bcrypt = require("bcrypt");
const { uploadOnCloudinary } = require("../Services/Cloudnary");
const mongoose = require("mongoose");

async function handleLogin(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const { password: _, ...userWithoutPassword } = user._doc;
    const accessToken = setUser(userWithoutPassword);

    return res
      .status(200)
      .json({ user: userWithoutPassword, token: accessToken });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Server error. Please try again later." });
  }
}

async function handleSignUp(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(200).json({ msg: "User Already Exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const { password: _, ...user } = newUser._doc;
    const payload = {
      email: newUser.email,
      _id: newUser._id,
    };

    const token = setUser(payload, process.env.ACCESS_TOKEN_SECRET_CODE);
    return res.json({ user, token });
  } catch (error) {
    return res.status(500).json({ error: "Server error. Please try again later." });
  }
}

async function handlecheck(req, res) {
  res.end("Hello");
}

const handleUpdateUser = async (req, res) => {
  const email = req.user.id;
  const updates = req.body;
  if (req.file) {
    updates.profile_picture = await uploadOnCloudinary(req.file.path); 
  }
  
  try {
    const user = await User.findByIdAndUpdate(email, updates,{
      new: true
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({ msg: "Profile updated successfully", user });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

async function handleGetUser(req, res) {
  try {
    const userID = req.user.id;

    const user = await User.findById(userID).select("-password");
    if (!user) return res.status(400).json({ msg: "User Not Found" });

    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error. Please try again later." });
  }
}
async function handleGetAnalytics(req, res) {
  try {
    const userID = req.user.id;

    const user = await User.findById(userID,'Analytics');
    if (!user) return res.status(400).json({ msg: "User Not Found" });

    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error. Please try again later." });
  }
}
async function handleAddToCart(req, res) {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ msg: "User Not Found" });
    }

    const productIndex = user.cart.findIndex(
      (item) => item.productID?.toString() === productId
    );

    if (productIndex > -1) {
      user.cart[productIndex].quantity += 1;
    } else {
      user.cart.push({
        productID: new mongoose.Types.ObjectId(productId),
        quantity: 1,
      });
    }

    await user.save();
    const updatedUser = await User.findById(userId).select("-password");
    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
}
 async function handleRecomandation(req, res) {
  try {
    const userId = req.body;
    

    const user = await User.findOne(
      userId,
      "product_data"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.product_data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function handleUpdateReconmand(req, res) {
  try {
    const userId = req.user.id;
    const { product_id, product_name, view_time, liked } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Flag to track if the product exists
    let productExists = false;

    // Update existing product data if it exists
    user.product_data.forEach((item) => {
      if (item.product_id === product_id) {
        item.visit_count += 1;
        item.view_time += view_time; // Add the new view time to the existing one
        item.liked = liked; // Update liked status
        item.product_name = product_name;
        productExists = true;
      }
    });

    // If the product doesn't exist, add new product data
    if (!productExists) {
      user.product_data.push({
        product_id,
        product_name,
        view_time,
        visit_count: 1,
        liked,
      });
    }

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: "Product data updated successfully", product_data: user.product_data });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}






module.exports = {
  handleLogin,
  handleSignUp,
  handleUpdateUser,
  handlecheck,
  handleGetUser,
  handleGetAnalytics,
  handleAddToCart,
  handleRecomandation,
  handleUpdateReconmand
};
