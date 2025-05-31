import Place from "../models/Places.js";

export const addPlace = async (req, res) => {
  try {
    const { title, address, photos, description, perks, extraInfo, checkin, checkout, maxGuests, price } = req.body;
    const newPlace = new Place({
      owner: req.user._id,
      title,
      address,
      photos,
      description,
      perks,
      extraInfo,
      checkin,
      checkout,
      maxGuests,
      price
    });
    await newPlace.save();
    res.status(201).json({ message: "Place added successfully!", place: newPlace });
  } catch (error) {
    console.error("Error adding place:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUserPlaces = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const places = await Place.find({ owner: userId });

    if (!places.length) {
      return res.status(404).json({ message: "No places found for this user" });
    }

    res.status(200).json(places);
  } catch (error) {
    console.error("Error fetching user places:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getPlaceById = async (req, res) => {
  try {
    const {action } = req.params;
    
    // Find the place by ID
    const place = await Place.findById(action);

    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }

    res.status(200).json(place);
  } catch (error) {
    console.error("Error fetching place by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updatePlaceById = async (req, res) => {
  try {
    const { action } = req.params;
    const { title, address, photos, description, perks, extraInfo, checkin, checkout, maxGuests, price } = req.body;

    const updatedPlace = await Place.findByIdAndUpdate(
      action,
      {
        title,
        address,
        photos,
        description,
        perks,
        extraInfo,
        checkin,
        checkout,
        maxGuests,
        price
      },
      { new: true } // Return the updated document
    );

    if (!updatedPlace) {
      return res.status(404).json({ message: "Place not found" });
    }

    res.status(200).json({ message: "Place updated successfully!", place: updatedPlace });
  } catch (error) {
    console.error("Error updating place:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deletePlaceById = async(req, res) => {
  try {
    const {action} = req.params;
    await Place.deleteOne({_id: action});
    return res.status(200).json({ message: "Place deleted successfully" });
  } catch (error) {
    console.log(error);
  }
}

