import { Hono } from "hono";
import { getAllUsers } from "../controllers/userController.js";

const userRouters = new Hono();

userRouters.get("/get-all-users", getAllUsers);

export default userRouters;
