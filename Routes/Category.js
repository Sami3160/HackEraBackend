const express = require("express");
const {
  handleGetCategory,
  handleCreateCategory,
  handleDeleteCategory,
  handleUpdateCategory,
} = require("../Controllers/Category");
const { authenticateToken, authAdmin } = require("../Middlewares/Auth");
const uploadMiddleware = require("../Middlewares/FileUpload");

const router = express.Router();

router
  .route("/category")
  .get(handleGetCategory)
  .post(authenticateToken, authAdmin,uploadMiddleware, handleCreateCategory);

router
  .route("/category/:id")
  .delete(authenticateToken, authAdmin, handleDeleteCategory)
  .put(authenticateToken, authAdmin, handleUpdateCategory);
module.exports = router;
