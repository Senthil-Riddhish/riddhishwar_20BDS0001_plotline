import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String }, // Added description property
  category: { type: String },    // Added category property
  // Other properties related to products
});

export const ProductModel = mongoose.model("Product", productSchema);
