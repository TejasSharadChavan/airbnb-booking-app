import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import authRoute from "./router/auth-router.js";
import connectDb from "./db.js";
import errorMiddleware from "./middlewares/error-middleware.js";
import placeRoute from "./router/place-router.js";
import bookRoute from "./router/booking-router.js";
import { fileURLToPath } from "url";
import path from "path";
import multer from "multer";
import fs from "fs";
import Place from "./models/Places.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT | 3000;

app.use(
  cors({
    credentials: true,
    methods: "GET, PUT, POST, DELETE, PATCH, HEAD",
    origin: "http://localhost:5173",
  })
);
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoute);

app.use(errorMiddleware);

app.use("/uploads", express.static(__dirname + "/uploads"));
const photosMiddleware = multer({ dest: "uploads/" });
app.post("/upload", photosMiddleware.array("photos", 100), (req, res) => {
  try {
    const uploadedFiles = [];

    req.files.forEach((file) => {
      const ext = path.extname(file.originalname); // Get file extension
      const newPath = `${file.path}${ext}`; // Rename file with extension
      fs.renameSync(file.path, newPath);
      uploadedFiles.push(path.basename(newPath)); // ✅ Store only filename, not full path
    });

    res.json(uploadedFiles); // ✅ Send filenames without extra `/uploads/`
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to upload files" });
  }
});

app.use("/api/places", placeRoute);
app.use("/api/bookings", bookRoute);

app.get("/data", async (req, res) => {
  try {
    const places = await Place.find();

    if (!places.length) {
      return res.status(404).json({ message: "No places available" });
    }

    res.status(200).json(places);
    // console.log(places);
  } catch (error) {
    console.error("Error fetching all places:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get(`/place/:id`, async (req, res) => {
  try {
    const { id } = req.params;

    // Find the place by ID
    const place = await Place.findById(id);

    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }
    console.log(place);
    res.status(200).json(place);
  } catch (error) {
    console.error("Error fetching the place by id:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Listening at port 3000`);
  });
});
