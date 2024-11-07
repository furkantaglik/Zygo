import { Hono } from "hono";
import { getAllUsers } from "../controllers/userController.js";

const userRouters = new Hono();

userRouters.get("/getallusers", getAllUsers);

export default userRouters;
