import express from "express";
import {
  addPlace,
  getUserPlaces,
  getPlaceById,
  updatePlaceById,
  deletePlaceById,
} from "../controllers/place-controllers.js";
import authMiddleware from "../middlewares/auth-middleware.js";

const router = express.Router();

router.post("/", authMiddleware, addPlace);

router.get("/", authMiddleware, getUserPlaces);

router.get("/:action", authMiddleware, getPlaceById);

router.put("/:action", authMiddleware, updatePlaceById);

router.delete("/:action", authMiddleware, deletePlaceById);

// router.post("/bookings", authMiddleware, createBookings);

// router.get("/bookings", authMiddleware, getBookedDetails);


export default router;
