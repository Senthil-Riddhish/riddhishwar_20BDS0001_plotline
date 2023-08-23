import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  itemType: { type: String, enum: ["product", "service"], required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
  itemName: { type: String, required: true },
  itemPrice: { type: Number, required: true },
  itemTaxRate: { type: Number, required: true },
  //itemTax: { type: Number, required: true },
  itemTotal: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  orders: [
    {
      items: [orderItemSchema],
      totalCost: { type: Number, required: true },
      totalTax: { type: Number, required: true },
      totalBill: { type: Number, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  // Other user-related properties
});

export const OrderModel = mongoose.model("Order", orderSchema);
