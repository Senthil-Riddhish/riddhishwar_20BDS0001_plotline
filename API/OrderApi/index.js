import express from "express";
import { OrderModel, CartModel, ProductModel, ServiceModel,UserModel } from "../../Database/allModels"; // Adjust the import path
import { isAdmin } from "../../Validation/isAdmin";
const Router = express.Router();

const calculateTaxRate = (price, itemType) => {
  if (itemType === "product") {
    if (price > 1000 && price <= 5000) {
      return (price * 0.12) + 200; // ApplyTaxPA
    } else if (price > 5000) {
      return (price * 0.18) + 200; // ApplyTaxPB
    } else {
      return 200; // ApplyTaxPC
    }
  } else if (itemType === "service") {
    if (price > 1000 && price <= 8000) {
      return (price * 0.10) + 100; // ApplyTaxSA
    } else if (price > 8000) {
      return (price * 0.15) + 100; // ApplyTaxSB
    } else {
      return 100; // ApplyTaxSC
    }
  }
};


/**
 * Router       /confirm-order/:userId
 * Des          Confirm the order
 * Params       Path params(userId)
 * Access       Public
 * Method       POST
 */

Router.post("/confirm-order/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Retrieve the user's cart
    const userCart = await CartModel.findOne({ userId });
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const verifiedUserId = UserModel.verifyJwtToken(token);

    if (!verifiedUserId || verifiedUserId !== userId) {
      return res.status(401).json({ error: "Session expired. Please log in again." });
    }
    if (!userCart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    if (userCart.items.length === 0) {
      return res.status(400).json({ message: "No items available in the cart" });
    }

    // Calculate total cost, total tax, and total bill
    let totalCost = 0;
    let totalTax = 0;
    const orderItems = [];

    // Calculate tax, total, and collect order items
    for (const cartItem of userCart.items) {
      let itemInfo;

      // Determine which model to use based on itemType
      if (cartItem.itemType === 'product') {
        itemInfo = await ProductModel.findById(cartItem.itemId);
      } else if (cartItem.itemType === 'service') {
        itemInfo = await ServiceModel.findById(cartItem.itemId);
      }

      if (!itemInfo) {
        return res.status(404).json({ error: "Item not found" });
      }

      const itemTaxRate = calculateTaxRate(itemInfo.price, cartItem.itemType);
      //const itemTax = itemInfo.price * itemTaxRate;
      const itemTotal = itemInfo.price + itemTaxRate;

      totalCost += itemInfo.price * cartItem.quantity;
      totalTax += itemTaxRate * cartItem.quantity;

      orderItems.push({
        itemType: cartItem.itemType,
        itemId: cartItem.itemId,
        itemName: itemInfo.name,
        itemPrice: itemInfo.price,
        itemTaxRate: itemTaxRate,
        //itemTax: itemTax,
        itemTotal: itemTotal,
        quantity: cartItem.quantity,
      });
    }

    const totalBill = totalCost + totalTax;

    // Create a new order item
    const newOrderItem = {
      items: orderItems,
      totalCost,
      totalTax,
      totalBill,
    };

    // Update the user's order history
    const updatedUserOrder = await OrderModel.findOneAndUpdate(
      { userId: userId },
      { $push: { orders: newOrderItem } },
      { new: true, upsert: true }
    );

    // Clear the user's cart
    userCart.items = [];
    await userCart.save(); // Save the cleared cart

    return res.status(200).json({ message: "Order confirmed successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * Router       /admin/orders
 * Des          Admin-only route to view all orders
 * Access       Only Admin
 * Method       Get
*/

Router.get("/admin/orders", isAdmin, async (req, res) => {
  try {
    const orders = await OrderModel.find();

    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * Router       /orders/:userId
 * Des          orders with userId
 * Params       Path params(userId)
 * Access       Based on UserId
 * Method       GET
 */

Router.get("/orders/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const verifiedUserId = UserModel.verifyJwtToken(token);

    if (!verifiedUserId || verifiedUserId !== userId) {
      return res.status(401).json({ error: "Session expired. Please log in again." });
    }

    // Retrieve orders for the specified user
    const userOrders = await OrderModel.find({ userId: userId });

    if (!userOrders || userOrders.length === 0) {
      return res.status(404).json({ message: "No orders have been placed" });
    }

    return res.status(200).json(userOrders);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default Router;
