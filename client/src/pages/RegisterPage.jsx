import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
export const RegisterPage = () => {
  const { storeTokenInLS } = useAuth();
  const [view, setView] = useState(false);
  const navigate = useNavigate();
  const userObj = {
    name: "",
    email: "",
    password: "",
  };
  const [logger, setLogger] = useState(userObj);
  const handleInput = (e) => {
    const { value, name } = e.target;
    setLogger({
      ...logger,
      [name]: value,
    });
  };
  const handleViewToggle = () => {
    setView(!view);
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/register", logger, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Response:", response);
      // const res_data = await response.json();
      if (response.status === 201) {
        toast.success(response.data.message);
        storeTokenInLS(response.data.token);
        setLogger(userObj);
        navigate("/");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMsg =
          error.response.data.extraDetails || error.response.data.message;
        toast.error(errorMsg);
      }
    }
  };

  return (
    <>
      <div className="sm:mt-10 border w-fit p-6 mt-15 ml-5 mr-5 sm:p-10 sm:mx-auto rounded-xl border-primary">
        <h1 className="text-center text-4xl font-bold">Register</h1>
        <form className="max-w-sm mt-2" onSubmit={handleFormSubmit}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            id="name"
            name="name"
            autoComplete="off"
            autoFocus
            value={logger.name}
            onChange={handleInput}
          />
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="off"
            placeholder="your@email.com"
            value={logger.email}
            onChange={handleInput}
          />
          <label htmlFor="password">Password</label>
          <div className="relative">
            <input
              type={view ? "text" : "password"}
              id="password"
              name="password"
              placeholder="******"
              autoComplete="off"
              value={logger.password}
              onChange={handleInput}
            />
            <span
              className="absolute inset-y-0 right-5 top-6 cursor-pointer text-gray-500 hidden sm:block"
              onClick={handleViewToggle}
            >
              {view ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button type="submit" className="primary cursor-pointer">
            Register
          </button>
          <div className="flex gap-2 mt-2 justify-center">
            <h1>Already an user?</h1>
            <Link className="text-primary" to={"/login"}>
              Login Now
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};
