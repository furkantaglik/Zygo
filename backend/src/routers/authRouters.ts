import { Hono } from "hono";
import { login, register } from "../controllers/authController.js";

const authRouters = new Hono();

authRouters.post("/register", register);
authRouters.post("/login", login);

export default authRouters;
