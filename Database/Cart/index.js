import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  items: [
    {
      itemType: { type: String, enum: ["product", "service"], required: true },
      itemId: { type: mongoose.Schema.Types.ObjectId, refPath: "items.itemType", required: true },
      quantity: { type: Number, default: 1 },
    },
  ]
});

export const CartModel = mongoose.model("Cart", cartSchema);

