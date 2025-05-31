import mongoose from "mongoose";

const placeSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: { type: String, required: true },
  address: { type: String, required: true },
  photos: { type: [String], required: true },
  description: { type: String, required: true },
  perks: { type: [String], default: [] },
  extraInfo: { type: String, required: true },
  checkin: { type: Number, required: true },
  checkout: { type: Number, required: true },
  maxGuests: { type: Number, required: true },
  price: { type: Number, required: true },

});

const Place = mongoose.model("Place", placeSchema);
export default Place;
