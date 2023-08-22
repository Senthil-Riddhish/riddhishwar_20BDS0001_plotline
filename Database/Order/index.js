import mongoose from "mongoose";
const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    items: [
      {
        itemType: { type: String, enum: ["product", "service"], required: true },
        itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
        itemName: { type: String, required: true },
        itemPrice: { type: Number, required: true },
        itemTaxRate: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    totalCost: { type: Number, required: true },
    totalTax: { type: Number, required: true },
    totalBill: { type: Number, required: true },
    // Other order-related properties
  });
  
 export  const OrderModel = mongoose.model("Order", orderSchema);
  