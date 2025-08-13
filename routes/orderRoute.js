import express from "express";
import { placeOrder, verifyOrderOTP } from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/place", placeOrder);
orderRouter.post("/verify-otp", verifyOrderOTP);

export default orderRouter;
