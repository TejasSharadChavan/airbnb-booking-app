import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MdInsertPhoto } from "react-icons/md";
import { FaMapMarkerAlt } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { GiHouse } from "react-icons/gi";
import { BookingWidget } from "./BookingWidget";
import { useAuth } from "../store/auth";
export const SinglePage = () => {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const { isloggedIn } = useAuth();

  const getSinglePlaceData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/place/${id}`);
      setPlace(response.data);
    } catch (error) {
      console.error("Error fetching place:", error);
    }
  };

  useEffect(() => {
    if (id) {
      getSinglePlaceData();
    }
  }, [id]);

  if (showAllPhotos) {
    return (
      <div className="absolute inset-0 bg-black min-h-screen z-1000 ">
        <div className="p-8 grid gap-4 bg-black">
          <h2 className="text-3xl font-semibold text-white flex items-center gap-1">
            <GiHouse className="text-primary" />
            {place.title}
          </h2>
          <button
            onClick={() => setShowAllPhotos(false)}
            className=" cursor-pointer fixed top-8 right-15 bg-gray-400 rounded-2xl "
          >
            <div className="flex items-center p-2 gap-1 ">
              <IoCloseSharp />
              Close
            </div>
          </button>
          {place?.photos?.length > 0 &&
            place.photos.map((photo, key) => (
              <div className="w-1/2 mx-auto" key={key}>
                <img
                  className="w-full h-150"
                  src={`${import.meta.env.VITE_API_BASE_URL}/uploads/${photo}`}
                  alt=""
                />
              </div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {place ? (
        <div className="bg-gray-100 px-4 md:px-8 py-6 md:py-8">
          {/* Title & Address */}
          <h1 className="text-xl md:text-2xl font-bold mb-2 text-gray-700 capitalize text-center md:text-left">
            {place.title}
          </h1>
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-sm underline flex items-center justify-center md:justify-start gap-1"
            href={`https://maps.google.com/?q=${place.address}`}
          >
            <FaMapMarkerAlt className="text-primary" />
            {place.address}
          </a>

          {/* Image Gallery */}
          <div className="relative mt-4">
            <div className="grid grid-cols-6 gap-2 mt-4 z-10">
              {/* First Image - Full Width on Mobile, Half on Larger Screens */}
              <div className="col-span-3 row-span-2">
                {place.photos?.[0] && (
                  <img
                    onClick={() => setShowAllPhotos(true)}
                    className="w-full h-64 sm:h-full object-cover rounded-lg cursor-pointer"
                    src={`${import.meta.env.VITE_API_BASE_URL}/uploads/${place.photos[0]}`}
                    alt="Main"
                  />
                )}
              </div>

              {/* Second Image */}
              <div className="h-70 col-span-3 row-span-1">
                {place.photos?.[1] && (
                  <img
                    onClick={() => setShowAllPhotos(true)}
                    className="w-full h-64 sm:h-full object-cover rounded-lg cursor-pointer"
                    src={`${import.meta.env.VITE_API_BASE_URL}/uploads/${place.photos[1]}`}
                    alt="Second"
                  />
                )}
              </div>

              {/* Third Image (Visible on Larger Screens) */}
              <div className="h-70 col-span-3">
                {place.photos?.[2] && (
                  <img
                    onClick={() => setShowAllPhotos(true)}
                    className="w-full h-full object-cover rounded-lg cursor-pointer"
                    src={`${import.meta.env.VITE_API_BASE_URL}/uploads/${place.photos[2]}`}
                    alt="Third"
                  />
                )}
              </div>
            </div>

            {/* Show More Photos Button */}
            <div
              onClick={() => setShowAllPhotos(true)}
              className="absolute bottom-4 right-4 p-2 sm:p-3 bg-white rounded-xl opacity-80 shadow-md cursor-pointer flex gap-2 items-center"
            >
              <MdInsertPhoto />
              <span className="text-sm sm:text-base">Show More Photos</span>
            </div>
          </div>

          {/* Booking Widget */}
          <div className="mt-6">
            <BookingWidget place={place} isloggedIn={isloggedIn} />
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">Loading...</p>
      )}
    </>
  );
};
