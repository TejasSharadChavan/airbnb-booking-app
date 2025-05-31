import express from "express";
import {
  createBookings,
  getBookedDetails,
} from "../controllers/bookings-controller.js";
import authMiddleware from "../middlewares/auth-middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createBookings);

router.get("/", authMiddleware, getBookedDetails);

export default router;
