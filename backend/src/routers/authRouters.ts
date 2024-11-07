import { Hono } from "hono";
import { register } from "../controllers/auth/registerController.js";
import { login } from "../controllers/auth/loginController.js";

const authRouters = new Hono();

authRouters.post("/register", register);
authRouters.post("/login", login);

export default authRouters;
