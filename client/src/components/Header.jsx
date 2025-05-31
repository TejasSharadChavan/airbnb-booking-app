import { IoMdSearch } from "react-icons/io";
import { PiPaperPlaneRightLight } from "react-icons/pi";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaUser } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import { useEffect, useState } from "react";

export const Header = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      navigate(`/?search=${searchQuery}`); // Update URL with search query
      setSearchQuery("");
    }
  };

  return (
    <>
      <header className="flex p-4 border border-b border-gray-200 justify-between sticky z-100 top-0 bg-white">
        <NavLink to={"/"} href="" id="logo" className="flex items-center">
          <div id="paperplane" className="text-5xl -rotate-90 text-primary">
            <PiPaperPlaneRightLight />
          </div>
          <span className="text-xl font-semibold">airbnb</span>
        </NavLink>
        <div
          id="search-bar"
          className="px-2 gap-2 flex p-2 border border-gray-400 rounded-4xl sm:gap-4 sm:px-3 items-center shadow-md shadow-gray-300 hidden sm:flex"
        >
          <div className="bg-primary text-white p-2 rounded-full">
            <IoMdSearch />
          </div>
          <div className="">
            <input
              type="search"
              name=""
              id=""
              className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary sm:p-2 gap-3 sm:w-full 
              "
              placeholder="Search here"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch} // Trigger search on Enter key
            />
          </div>
        </div>
        <div className="flex gap-3">
          <NavLink
            to={user ? "/account" : "/login"}
            id="profile"
            className="flex sm:border sm:border-gray-400 rounded-4xl gap-4 px-3 items-center shadow-md shadow-gray-300"
          >
            <GiHamburgerMenu />
            <div
              id="user"
              className="border rounded-full p-2 text-white bg-primary hidden sm:block"
            >
              <FaUser />
            </div>
            <h2 className="hidden sm:block">{user.name}</h2>
          </NavLink>
        </div>
      </header>
    </>
  );
};
