import express from "express";
import { ServiceModel } from "../../Database/allModels"; // Adjust the import path
import { ValidateService } from "../../Validation/service"; // Adjust the import path

const Router = express.Router();

const isAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decodedUserId = UserModel.verifyJwtToken(token);
    if (!decodedUserId) {
      return res.status(401).json({ error: "Session expired. Please log in again." });
    }

    const user = await UserModel.findById(decodedUserId);

    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admin privileges required." });
    }

    next(); // If user is admin, proceed to the next middleware
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


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
Router.post("/add-service", isAdmin, async (req, res) => {
  try {
    await ValidateService(req.body); // Assuming req.body contains the service data
    const newService = await ServiceModel.create(req.body);
    return res.status(201).json({ service: newService });
  } catch (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
});

// Update a service
Router.post("/update-service", isAdmin, async (req, res) => {
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
Router.post("/delete-service", isAdmin, async (req, res) => {
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
