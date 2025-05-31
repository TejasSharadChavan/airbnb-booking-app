import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainPage } from "./pages/MainPage";
import { LoginPage } from "./pages/LoginPage";
import { Layout } from "./layout/Layout";
import { RegisterPage } from "./pages/RegisterPage";
import axios from "axios";
import { Logout } from "./pages/Logout";
import { Account } from "./pages/Account";
import { SinglePage } from "./pages/SinglePage";

axios.defaults.baseURL = `${import.meta.env.VITE_API_BASE_URL}/api/auth`;

export const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<MainPage />}></Route>
            <Route path="/login" element={<LoginPage />}></Route>
            <Route path="/register" element={<RegisterPage />}></Route>
            <Route path="/logout" element={<Logout />}></Route>
            <Route path="/account/:subpage?" element={<Account />}></Route>
            <Route
              path="/account/:subpage/:action"
              element={<Account />}
            ></Route>
            <Route path="/place/:id" element={<SinglePage />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};
