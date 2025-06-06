import express from "express";
import { ProductModel,UserModel } from "../../Database/allModels"; // Adjust the import path
import { ValidateProduct } from "../../Validation/product"; // Adjust the import path
import { isAdmin } from "../../Validation/isAdmin";

const Router = express.Router();

const jwt = require("jsonwebtoken");


// Get all products
Router.get("/", async (req, res) => {
  try {
    const products = await ProductModel.find();
    return res.status(200).json({ products });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Add a new product
Router.post("/add-product", isAdmin, async (req, res) => {
  try {
    await ValidateProduct(req.body); // Assuming req.body contains the product data
    const newProduct = await ProductModel.create(req.body);
    return res.status(201).json({ product: newProduct });
  } catch (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
});

// Update a product
Router.post("/update-product/:productId", isAdmin, async (req, res) => {
  try {
    await ValidateProduct(req.body); 
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      req.params.productId,
      {
        $set: req.body,
      },
      { new: true }
    );
    return res.status(200).json({ product: updatedProduct });
  } catch (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
});

// Delete a product
/*Router.post("/delete-product/:productId", isAdmin, async (req, res) => {
  try {
    const deletedProduct = await ProductModel.findByIdAndDelete(
      req.params.productId
    );
    return res.status(200).json({ product: deletedProduct });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});*/

export default Router;