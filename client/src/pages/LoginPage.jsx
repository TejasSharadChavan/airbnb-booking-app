import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../store/auth";

export const LoginPage = () => {
  const [view, setView] = useState(false);
  const navigate = useNavigate();
  const { storeTokenInLS } = useAuth();
  const userObj = {
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
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/login", logger);
      console.log("Response:", response);
      // const res_data = await response.json();
      if (response.status === 200) {
        toast.success(response.data.msg);
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
  const handleViewToggle = () => {
    setView(!view);
  };
  return (
    <>
      <div className="mt-10 border w-fit p-5 sm:p-10 mx-auto rounded-xl border-primary">
        <h1 className="text-center text-4xl font-bold">Login</h1>
        <form className="max-w-sm mt-2" onSubmit={handleFormSubmit}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="off"
            autoFocus
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
          <button type="submit" className="primary">
            Login
          </button>
          <div className="flex gap-2 mt-2 justify-center">
            <h1>Dont have an account?</h1>
            <Link className="text-primary" to={"/register"}>
              Register Now
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};
