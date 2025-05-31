import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../store/auth";
import { GiNightSleep } from "react-icons/gi";
import { CiSun } from "react-icons/ci";
import { FaRegCalendarAlt } from "react-icons/fa";
import { MdOutlinePriceChange } from "react-icons/md";
import { Link } from "react-router-dom";
export const DisplayBookings = () => {
  const [bookings, setBookings] = useState([]);
  const calculateNights = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    const difference = (outDate - inDate) / (1000 * 60 * 60 * 24);
    return difference > 0 ? difference : 0;
  };

  const { token } = useAuth();
  const getBookings = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setBookings(response.data);
        // console.log(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBookings();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      {bookings.length > 0 ? (
        bookings.map((booking) => (
          <Link
            to={`/place/${booking.place._id}`}
            key={booking._id}
            className="border rounded-2xl shadow-lg p-4 mt-4 mx-auto flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-5 bg-white w-full md:w-3/4"
          >
            {/* Image */}
            <div className="w-full md:w-50 h-40 overflow-hidden rounded-lg">
              {booking.place.photos?.length > 0 && (
                <img
                  src={`http://localhost:3000/uploads/${booking.place.photos[0]}`}
                  alt="Place"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
  
            {/* Booking Details */}
            <div className="text-sm w-full px-2 md:px-0">
              {new Date(booking.checkOut) < new Date() && (
                <p className="text-red-600 font-bold md:text-left">
                  Previously Booked!!
                </p>
              )}
              <h2 className="font-semibold text-lg md:text-2xl md:text-left">
                {booking.place.title || "N/A"}
              </h2>
              <p className="text-gray-600 flex items-center gap-1 text-sm md:text-lg">
                <FaRegCalendarAlt />
                Check-in:
                {new Date(booking.checkIn).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
              <p className="text-gray-600 flex items-center gap-1 text-sm md:text-lg">
                <FaRegCalendarAlt />
                Check-out:
                {new Date(booking.checkOut).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
              <p className="text-gray-600 flex items-center gap-2 text-sm md:text-lg">
                <CiSun />
                Day: {calculateNights(booking.checkIn, booking.checkOut) + 1} ,
                <GiNightSleep />
                Night: {calculateNights(booking.checkIn, booking.checkOut)}
              </p>
              <p className="text-gray-600 text-sm md:text-lg">
                Guests: {booking.guests}
              </p>
              <p className="text-green-700 font-bold text-sm md:text-lg flex items-center gap-1">
                <MdOutlinePriceChange />₹{booking.totalPrice}
              </p>
            </div>
          </Link>
        ))
      ) : (
        <p className="text-center text-gray-500">No bookings found.</p>
      )}
    </div>
  );
  
};
