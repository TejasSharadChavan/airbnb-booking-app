import { useState } from "react";
import { FaAngleDoubleRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../store/auth";
import axios from "axios";
import emailjs from "@emailjs/browser";

export const BookingWidget = ({ place, isloggedIn }) => {
  const today = new Date().toISOString().split("T")[0];
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const { user } = useAuth();
  const [name, setName] = useState(user.name);
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { token } = useAuth();

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    const difference = (outDate - inDate) / (1000 * 60 * 60 * 24);
    return difference > 0 ? difference : 0;
  };

  const nights = calculateNights();
  const totalPrice = nights * place.price;

  const handleBooking = async () => {
    if (!isloggedIn) {
      navigate("/login");
      toast.error("Login First!");
      return;
    }
    const serviceId = "service_3vslqyi";
    const templateId = "template_kqvkk9m";
    const publicKey = "14GJWH4MQAnaIi83S";

    const templateParams = {
      from_name: "Airbnb Room booking Services",
      to_email: email,
      to_name: name,
      message: `Your booking for ${place.title},${place.address} is successfully done!
  Thankyou for using our services.`,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/api/bookings",
        {
          place: place._id,
          checkIn,
          checkOut,
          guests,
          name,
          mobile,
          email,
          totalPrice,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 201) {
        toast.success(response.data.message);
        emailjs
          .send(serviceId, templateId, templateParams, publicKey)
          .then(() => {
            toast.success("Booking confirmation email sent!");
          })
          .catch((error) => {
            console.error("Error sending email:", error);
            toast.error("Failed to send confirmation email.");
          });
        navigate("/account/bookings");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        "Something went wrong. Please try again!";
      toast.error(errorMessage);
    }
  };
  return (
    <>
      <div className="my-4 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Section: Description */}
          <div>
            <h2 className="font-semibold text-2xl">Description</h2>
            <p className="text-gray-700">{place.description}</p>

            {/* Check-In, Check-Out, Max Guests */}
            <div className="flex flex-wrap mt-5 gap-2">
              <h2 className="bg-gray-400 p-2 rounded-xl text-white text-center w-full sm:w-auto">
                Check-In: {place.checkin} AM
              </h2>
              <h2 className="bg-gray-400 p-2 rounded-xl text-white text-center w-full sm:w-auto">
                Check-Out: {place.checkout} PM
              </h2>
              <h2 className="bg-gray-400 p-2 rounded-xl text-white text-center w-full sm:w-auto">
                Max Guests: {place.maxGuests}
              </h2>
            </div>

            {/* Extra Info */}
            <div className="mt-5">
              <h2 className="font-semibold text-2xl">Extra Info</h2>
              <p className="text-gray-700">{place.extraInfo}</p>
            </div>

            {/* Perks Section */}
            <h2 className="font-semibold text-2xl mt-5">Perks</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {place.perks.map((perk, key) => (
                <p className="underline p-2 flex items-center gap-1" key={key}>
                  <FaAngleDoubleRight />
                  {perk === "entrance"
                    ? `Private ${perk}`.toUpperCase()
                    : perk.toUpperCase()}
                </p>
              ))}
            </div>
          </div>

          {/* Right Section: Booking Form */}
          <div className="h-full p-4 flex flex-col items-center bg-white border border-gray-400 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold text-primary">
              ₹{place.price}/night
            </h2>
            {/* Booking Inputs */}
            <div className="flex flex-col mt-3 text-center w-full max-w-md">
              <label htmlFor="check-in" className="font-semibold">
                CHECK IN
              </label>
              <input
                className="bg-gray-100 p-2 rounded-lg border w-full"
                type="date"
                id="check-in"
                value={checkIn}
                min={today}
                onChange={(e) => setCheckIn(e.target.value)}
              />
              <label htmlFor="check-out" className="font-semibold mt-2">
                CHECK OUT
              </label>
              <input
                className="bg-gray-100 p-2 rounded-lg border w-full"
                type="date"
                id="check-out"
                value={checkOut}
                min={checkIn}
                onChange={(e) => setCheckOut(e.target.value)}
              />

              <label htmlFor="guests" className="font-semibold mt-2">
                NO OF GUESTS
              </label>
              <input
                className="bg-gray-100 p-2 rounded-lg border w-full"
                type="number"
                id="guests"
                value={guests}
                min={1}
                onChange={(e) => setGuests(e.target.value)}
              />

              {/* Additional Fields if Nights Selected */}
              {nights > 0 && (
                <>
                  <label htmlFor="name" className="font-semibold mt-2">
                    Full Name
                  </label>
                  <input
                    className="bg-gray-100 p-2 rounded-lg border w-full"
                    id="name"
                    type="text"
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />

                  <label htmlFor="mobile" className="font-semibold mt-2">
                    Mobile Number
                  </label>
                  <input
                    className="bg-gray-100 p-2 rounded-lg border w-full"
                    placeholder="Enter mobile no"
                    id="mobile"
                    type="text"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    required
                  />

                  <label htmlFor="email" className="font-semibold mt-2">
                    Email
                  </label>
                  <input
                    className="bg-gray-100 p-2 rounded-lg border w-full"
                    placeholder="Enter email"
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </>
              )}
            </div>

            {/* Booking Button */}
            <button
              onClick={handleBooking}
              className="primary w-full max-w-md p-4 mt-4 rounded-lg text-white bg-primary hover:bg-primary-dark"
            >
              {nights > 0 ? `Book Now (₹${totalPrice})` : "Book Now"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
