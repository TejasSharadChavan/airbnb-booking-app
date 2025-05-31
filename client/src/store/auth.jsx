import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [token, setToken] = useState(localStorage.getItem("airbnb"));
  const [isLoading, setIsLoading] = useState(true);

  // tackling token storing in
  const storeTokenInLS = (serverToken) => {
    setToken(serverToken);
    return localStorage.setItem("airbnb", serverToken);
  };

  // tackling logout functionality
  const logoutUser = () => {
    setToken("");
    setUser("");
    if (!token) toast.success("Logout Successfully");
    return localStorage.removeItem("airbnb");
  };
  // loggedIn
  const isloggedIn = !!token;

  const userAuthentication = async () => {
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return; // Stop execution if no token is found
    }
    try {
      const response = await axios.get("/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.status === 200) {
        console.log("User Data:", response.data);
        setUser(response.data.userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Authentication Error:", error.response?.data || error.message);
      setUser(null);
      logoutUser(); // Clear token if authentication fails
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (token) {
      userAuthentication();
    } else {
      setIsLoading(false); // Avoid infinite loading if no token
    }
  }, [token]);
  
  return (
    <AuthContext.Provider value={{ storeTokenInLS, logoutUser, isloggedIn, user, isLoading, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const authContextValue = useContext(AuthContext);
  if (!authContextValue) {
    throw new Error("useAuth used outside of the Provider");
  }
  return authContextValue;
};
