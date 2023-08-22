import express from "express";
import { CartModel, ProductModel, ServiceModel } from "../../Database/allModels"; // Adjust the import paths
import { ValidateCartItem } from "../../Validation/cart";
const Router = express.Router();

// Add a product or service to the cart
Router.post("/add/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const { itemType, itemId, quantity } = req.body;
      
      if (itemType === "product") {
        await ProductModel.findById(itemId); // Check if the product exists
      } else if (itemType === "service") {
        await ServiceModel.findById(itemId); // Check if the service exists
      } else {
        return res.status(400).json({ error: "Invalid item type" });
      }
  
      const cart = await CartModel.findOneAndUpdate(
        { userId },
        { $push: { items: { itemType, itemId, quantity } } },
        { new: true, upsert: true }
      );
  
      return res.status(200).json({ cart });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  });
  
  // Remove a product or service from the cart
  Router.delete("/remove/:userId/:itemId", async (req, res) => {
    try {
      const { userId, itemId } = req.params;
      
      const cart = await CartModel.findOneAndUpdate(
        { userId },
        { $pull: { items: { itemId } } },
        { new: true }
      );
  
      return res.status(200).json({ cart });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });
  
  // Clear the entire cart for a user
  Router.delete("/clear/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
  
      const cart = await CartModel.findOneAndUpdate(
        { userId },
        { $set: { items: [] } },
        { new: true }
      );
  
      return res.status(200).json({ cart });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });


  
  export default Router;