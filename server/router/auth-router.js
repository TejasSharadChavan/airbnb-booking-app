import express from "express";
import {
  home,
  register,
  login,
  user,
  linkPhoto,
} from "../controllers/auth-controller.js";
import authMiddleware from "../middlewares/auth-middleware.js";
import validate from "../middlewares/validate-middleware.js";
import signupSchema from "../validators/auth-validators.js";

const router = express.Router();

router.route("/").get(home);
router.route("/register").post(validate(signupSchema), register);
router.route("/login").post(login);
router.route("/user").get(authMiddleware, user);
router.route("/upload-by-link").post(linkPhoto);



export default router;
