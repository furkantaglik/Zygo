import { Hono } from "hono";
import {
  getAllUsers,
  getByEmail,
  getByUserId,
  getByUsername,
} from "../controllers/userController.js";

const userRouters = new Hono();

userRouters.get("/get-all-users", getAllUsers);
userRouters.get("/get-by-userId/:userId", getByUserId);
userRouters.get("/get-by-username/:username", getByUsername);
userRouters.get("/get-by-email/:email", getByEmail);

export default userRouters;
