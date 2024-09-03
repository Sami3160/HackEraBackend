const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    trim: true,
  },

  profile_picture: {
    type: Object,
    default: {
      public_id: null,
      url: "https://static.vecteezy.com/system/resources/previews/007/469/004/non_2x/graduated-student-in-simple-flat-personal-profile-icon-or-symbol-people-concept-illustration-vector.jpg",
    },
  },

  role: {
    type: Number,
    default: 0,
  },

  phone_number: {
    type: String,
  },

  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zip_code: { type: String },
    country: { type: String },
    default: {},
  },

  date_of_birth: {
    type: String,
  },

  gender: {
    type: String,
    default: "other",
  },
  cart: [
    {
      productID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
        min: 1,
      },
    },
  ],
  fav: [
    {
      productID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
        min: 1,
      },
    },
  ],

  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  Analytics: {
    totalOrder: { type: Number, default: 0 },
    averageDailysales: { type: Number, default: 0 },
    pendingOrder: { type: Number, default: 0 },
    newCustomerThis: { type: Number, default: 0 },
  },
  product_data: [
    {
      product_id: { type: String, required: true },
      product_name: String,
      view_time: Number,
      visit_count: Number,
      liked: Number,
    },
  ],
});
const User = mongoose.model("User", UserSchema);
module.exports = User;
