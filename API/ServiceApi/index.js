import express from "express";
import { ServiceModel } from "../../Database/allModels"; // Adjust the import path
import { ValidateService } from "../../Validation/service"; // Adjust the import path

const Router = express.Router();

// Get all services
Router.get("/", async (req, res) => {
  try {
    const services = await ServiceModel.find();
    return res.status(200).json({ services });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Add a new service
Router.post("/add", async (req, res) => {
  try {
    await ValidateService(req.body); // Assuming req.body contains the service data
    const newService = await ServiceModel.create(req.body);
    return res.status(201).json({ service: newService });
  } catch (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
});

// Update a service
Router.put("/:serviceId", async (req, res) => {
  try {
    await ValidateService(req.body); // Assuming req.body contains the service data
    const updatedService = await ServiceModel.findByIdAndUpdate(
      req.params.serviceId,
      {
        $set: req.body,
      },
      { new: true }
    );
    return res.status(200).json({ service: updatedService });
  } catch (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
});

// Delete a service
Router.delete("/:serviceId", async (req, res) => {
  try {
    const deletedService = await ServiceModel.findByIdAndDelete(
      req.params.serviceId
    );
    return res.status(200).json({ service: deletedService });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default Router;
