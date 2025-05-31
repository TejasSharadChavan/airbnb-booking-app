import { Link, Navigate, NavLink, useParams } from "react-router-dom";
import { useAuth } from "../store/auth";
import { PlacesPage } from "./PlacesPage";
import { FaList, FaRegUser } from "react-icons/fa";
import { PiBuildingOfficeFill } from "react-icons/pi";
import { DisplayBookings } from "./DisplayBookings";

export const Account = () => {
  const { user, isLoading, isloggedIn } = useAuth();
  const { subpage } = useParams();

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  const currentPage = subpage || "profile";

  function linkClasses(type) {
    let classes = "sm:p-2 sm:py-3 sm:px-6 flex items-center sm:gap-2 gap-10 p-2 px-8 py-8 ml-10";
    if (type === currentPage) {
      classes += " bg-primary text-white rounded-full";
    } else{
      classes += " bg-gray-200 rounded-full";
    }
    return classes;
  }

  return (
    <div>
      <nav className="flex w-full justify-center gap-2 mt-8">
        <Link to="/account" className={linkClasses("profile")}>
        <FaRegUser/> <p className="sm:block hidden">My Profile</p>
        </Link>
        <Link to="/account/bookings" className={linkClasses("bookings")}>
          <FaList/><p className="sm:block hidden">My Bookings</p>
        </Link>
        <Link to="/account/places" className={linkClasses("places")}>
          <PiBuildingOfficeFill /><p className="sm:block hidden">My Accommodations</p>
        </Link>
      </nav>
      {(subpage === "profile" || !subpage) && (
        <div className="mt-8 flex items-center flex-col gap-3"
        ><h2>Logged in as {user.name} with ({user.email})</h2>
        <div className="flex items-center">
        {isloggedIn ? <NavLink className="px-4 py-2 bg-white text-primary border-primary border p-2 rounded-xl" to="/logout">Logout</NavLink> : ""}
        </div>
        </div>
      )}
      {
        subpage === "bookings" && (
          <DisplayBookings/>
        )
      }
      {subpage === "places" && (
        <PlacesPage/>
      )}
    </div>
  );
};
