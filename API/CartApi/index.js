import express from "express";
import { CartModel, ProductModel, ServiceModel, UserModel } from "../../Database/allModels"; // Adjust the import paths
import { ValidateCartItem } from "../../Validation/cart";

const Router = express.Router();

// Add a product or service to the cart
Router.post("/add-to-cart/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { itemType, itemId, quantity } = req.body; // Assuming you receive itemType (product or service), itemId, and quantity

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const verifiedUserId = UserModel.verifyJwtToken(token);

    if (!verifiedUserId || verifiedUserId !== userId) {
      return res.status(401).json({ error: "Session expired. Please log in again." });
    }

    // Add the cart item to the user's cart
    const userCart = await CartModel.findOneAndUpdate(
      { userId },
      { $push: { items: { itemType, itemId, quantity } } },
      { new: true, upsert: true }
    );

    return res.status(200).json(userCart);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Remove a product or service from the cart
Router.patch("/remove/:userId/:itemId", async (req, res) => {
  try {
    const { userId, itemId } = req.params;
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const verifiedUserId = UserModel.verifyJwtToken(token);
    if (!verifiedUserId || verifiedUserId !== userId) {
      return res.status(401).json({ error: "Session expired. Please log in again." });
    }
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
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const verifiedUserId = UserModel.verifyJwtToken(token);
    if (!verifiedUserId || verifiedUserId !== userId) {
      return res.status(401).json({ error: "Session expired. Please log in again." });
    }
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

// Calculate tax amount based on tax rules


// Fetch product/service details based on itemType
async function getItemDetails(itemId, itemType) {
  const ItemModel = itemType === 'product' ? ProductModel : ServiceModel;
  try {
    return await ItemModel.findById(itemId);
  } catch (error) {
    return null; // Item not found or error occurred
  }
}

const calculateTaxAmount = (price, itemType) => {
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



// In your API route to view the cart
Router.get("/view-cart/:userId", async (req, res) => {
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

    // Fetch product/service details for each cart item
    const cartItemsWithDetails = await Promise.all(userCart.items.map(async (cartItem) => {
      const item = await getItemDetails(cartItem.itemId, cartItem.itemType);

      if (!item) {
        return null; // Item not found
      }

      const itemPrice = item.price;
      //console.log(itemPrice,cartItem.itemType);
      const itemTaxRate = calculateTaxAmount(itemPrice, cartItem.itemType);
      const itemTax = itemPrice + itemTaxRate;
      const itemTotal = itemTax * cartItem.quantity;

      return {
        itemType: cartItem.itemType,
        itemId: cartItem.itemId,
        itemName: item.name,
        itemPrice: itemPrice,
        itemTaxRate: itemTaxRate,
        itemTotal: itemTotal,
        quantity: cartItem.quantity,
      };
    }));

    // Filter out items that were not found
    const validCartItems = cartItemsWithDetails.filter(item => item !== null);

    const totalCost = validCartItems.reduce((total, item) => total + item.itemPrice * item.quantity, 0);
    const totalTax = validCartItems.reduce((total, item) => total + item.itemTaxRate * item.quantity, 0);
    console.log(totalTax);
    const totalBill = totalCost + totalTax;

    return res.status(200).json({
      items: validCartItems,
      totalCost: totalCost,
      totalTax: totalTax,
      totalBill: totalBill,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Update the quantity of a product or service in the cart
Router.patch("/update-quantity/:userId/:itemId", async (req, res) => {
  console.log("inside the logfunction");
  try {
    const { userId, itemId } = req.params;
    const { quantity } = req.body;

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const verifiedUserId = UserModel.verifyJwtToken(token);
    if (!verifiedUserId || verifiedUserId !== userId) {
      return res.status(401).json({ error: "Session expired. Please log in again." });
    }

    // Update the quantity of the specified item in the user's cart
    const updatedCart = await CartModel.findOneAndUpdate(
      { userId, "items.itemId": itemId },
      { $set: { "items.$.quantity": quantity } },
      { new: true }
    );

    if (!updatedCart) {
      return res.status(404).json({ error: "Cart not found or item not in cart" });
    }

    return res.status(200).json({ message: "Quantity updated successfully", cart: updatedCart });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default Router;