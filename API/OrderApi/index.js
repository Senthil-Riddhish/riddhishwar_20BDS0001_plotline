import express from "express";
import { OrderModel,CartModel } from "../../Database/allModels"; // Adjust the import path
const Router = express.Router();

const calculateTaxRate = (price, itemType) => {
    if (itemType === "product") {
      if (price > 1000 && price <= 5000) {
        return price * 0.12; // ApplyTaxPA
      } else if (price > 5000) {
        return price * 0.18; // ApplyTaxPB
      } else {
        return 200; // ApplyTaxPC
      }
    } else if (itemType === "service") {
      if (price > 1000 && price <= 8000) {
        return price * 0.10; // ApplyTaxSA
      } else if (price > 8000) {
        return price * 0.15; // ApplyTaxSB
      } else {
        return 100; // ApplyTaxSC
      }
    }
  };
  
Router.post("/confirm-order/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
  
      // Retrieve the user's cart
      const userCart = await CartModel.findOne({ userId });
  
      if (!userCart) {
        return res.status(404).json({ error: "Cart not found" });
      }
  
      // Calculate total cost, total tax, and total bill
      let totalCost = 0;
      let totalTax = 0;
      userCart.items.forEach((cartItem) => {
        const itemTaxRate = calculateTaxRate(cartItem.itemPrice, cartItem.itemType);
        const itemTax = cartItem.itemPrice + itemTaxRate;
        const itemTotal = itemTax* cartItem.quantity;
        totalCost += cartItem.itemPrice * cartItem.quantity;
        totalTax += itemTaxRate * cartItem.quantity;
      });
  
      const totalBill = totalCost + totalTax;
  
      // Create a new order document
      const newOrder = new OrderModel({
        userId: userCart.userId,
        items: userCart.items,
        totalCost,
        totalTax,
        totalBill,
        // Other order-related properties
      });
  
      await newOrder.save();
  
      // Clear the cart
      userCart.items = [];
      await userCart.save();
  
      return res.status(200).json({ message: "Order confirmed successfully" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });
  