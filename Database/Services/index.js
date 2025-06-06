import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String }, // Added description property
  duration: { type: Number },    // Added duration property
  // Other properties related to services
});

export const ServiceModel = mongoose.model("Service", serviceSchema);
