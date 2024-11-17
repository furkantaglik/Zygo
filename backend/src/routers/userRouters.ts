import { Hono } from "hono";
import {
  getAllUsers,
  getByEmail,
  getByUserId,
  getByUsername,
  updateUser,
} from "../controllers/userController.js";
import { uploadFile } from "../middlewares/uploadFile.js";

const userRouters = new Hono();
userRouters.post("/update-user/:userId", uploadFile, updateUser);
userRouters.get("/get-all-users", getAllUsers);
userRouters.get("/get-by-userId/:userId", getByUserId);
userRouters.get("/get-by-username/:username", getByUsername);
userRouters.get("/get-by-email/:email", getByEmail);

export default userRouters;
