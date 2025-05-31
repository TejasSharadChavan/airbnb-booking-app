import Booking from "../models/Bookings.js";
import Place from "../models/Places.js";

export const createBookings = async (req, res) => {
  try {
    const {
      place,
      checkIn,
      checkOut,
      guests,
      name,
      mobile,
      email,
      totalPrice,
    } = req.body;

    if (
      !place ||
      !checkIn ||
      !checkOut ||
      !guests ||
      !name ||
      !mobile ||
      !email ||
      !totalPrice
    ) {
      return res.status(400).json({ error: "All fields are required!" });
    }
    const existingBooking = await Booking.findOne({
      place: place, // Match the same place
      $or: [
        { checkIn: { $lt: new Date(checkOut), $gte: new Date(checkIn) } }, // Check-in within existing booking
        { checkOut: { $gt: new Date(checkIn), $lte: new Date(checkOut) } }, // Check-out within existing booking
        {
          checkIn: { $lte: new Date(checkIn) },
          checkOut: { $gte: new Date(checkOut) },
        }, // Existing booking fully overlaps
      ],
    });

    if (existingBooking) {
      return res.status(400).json({
        error: "This place is already booked for the selected dates.",
      });
    }

    const newBooking = new Booking({
      place,
      user: req.userID,
      checkIn,
      checkOut,
      guests,
      name,
      mobile,
      email,
      totalPrice,
    });

    await newBooking.save();
    res
      .status(201)
      .json({ message: "Booking successful!", booking: newBooking });
  } catch (error) {
    res.status(500).json({ error: "Internal server error!" });
  }
};

export const getBookedDetails = async (req, res) => {
  try {
    const userId = req.userID;

    const bookings = await Booking.find({ user: userId }).populate("place");

    if (!bookings.length) {
      return res
        .status(404)
        .json({ message: "No bookings found for this user" });
    }
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching user places:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
