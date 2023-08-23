//babel configurations
require("@babel/core").transform("code", {
  presets: ["@babel/preset-env"],
});

//importing Libraries
import express from "express";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import ConnectDB from "./Database/connection";

// API
import Auth from "./API/Auth";
import Product from './API/ProductApi';
import Service from "./API/ServiceApi";
import Cart from "./API/CartApi";
import Order from "./API/OrderApi";
import display from "./API/Display";

const plotline = express();
plotline.use(cors());
plotline.use(bodyParser.json());
plotline.use(helmet());


// Application Routes
plotline.use("/auth", Auth);
plotline.use("/product",Product);
plotline.use("/service",Service);
plotline.use("/cart",Cart);
plotline.use("/order",Order);
plotline.use("/display",display);




plotline.listen(4000, () => {
  ConnectDB()
    .then(() => {
      console.log("Server is running !!!");
    })
    .catch((error) => {
      console.log("Server is running, but database connection failed...");
      console.log(error);
    });
});

