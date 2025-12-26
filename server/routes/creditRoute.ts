import express from "express"
import { getPlans, purchasePlans } from "../controllers/creditController";
import { protect } from "../middlewares/auth";

const creditRouter = express.Router();

creditRouter.get("/plan", getPlans)
creditRouter.post("/purchase", protect, purchasePlans)

export default creditRouter