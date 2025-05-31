import User from "../models/User.js";
import imageDownloader from "image-downloader";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const home = async (req, res) => {
  try {
    res.status(200).send({ msg: "Its home page" });
  } catch (error) {
    res.status(500).json("Internal server error");
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(400).json({ message: "user already exits" });
    }
    const data = await User.create({ name, email, password });
    res.status(201).json({
      message: "Registration successful",
      token: await data.generateToken(),
      userId: data._id.toString(),
    });
  } catch (error) {
    return res.status(500).send("Internal server error");
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExist = await User.findOne({ email: email });
    if (!userExist) {
      return res.status(400).json({ message: "Invalid credentails" });
    }
    const user = await userExist.comparePass(password);
    if (user) {
      res.status(200).json({
        msg: "Login successful",
        token: await userExist.generateToken(),
        userId: userExist._id.toString(),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    return res.status(500).send("Internal server error");
  }
};

const user = async (req, res) => {
  try {
    const userData = req.user;
    console.log(userData);
    return res.status(200).json({ userData });
  } catch (error) {
    console.log(`Error from the user route ${error}`);
  }
};

const linkPhoto = async (req, res) => {
  try {
    const { link } = req.body;
    const newName = "photo" + Date.now() + ".jpg";
    const uploadDir = path.join(__dirname, "..", "uploads");
    const destination = path.join(uploadDir, newName);

    await imageDownloader.image({
      url: link,
      dest: destination,
    });

    res.json(newName);
  } catch (error) {
    console.error("Error downloading image:", error);
    res.status(500).json({ error: "Failed to download image" });
  }
};


// const uploadPhoto = async (req, res) => {
//   const uploadedFiles = [];
//   for(let i = 0; i < req.files.length; i++) {
//     const {path, originalname} = req.files[i];
//     const parts = originalname.split(".");
//     const ext = parts[parts.length - 1];
//     const newPath = path + "." + ext;
//     fs.renameSync(path, newPath);
//     uploadedFiles.push(`/uploads/${path.basename(newPath)}`);
//   }
//   res.json(uploadedFiles);
//   // res.json(req.files);
// };

export { home, register, login, user, linkPhoto };
