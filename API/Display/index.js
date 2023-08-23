import { ProductModel, UserModel, ServiceModel } from "../../Database/allModels";
const express = require("express");
const Router = express.Router();

/**
 * Router       /products-and-services
 * Des          Fetch all products and services with their prices
 * Access       Public
 * Method       GET
 */

Router.get("/products-and-services", async (req, res) => {
    try {
        const products = await ProductModel.find({}, "name price");
        const services = await ServiceModel.find({}, "name price");

        const allItems = [...products, ...services];

        return res.status(200).json(allItems);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

export default Router;