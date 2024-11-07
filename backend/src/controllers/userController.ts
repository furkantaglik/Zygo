import type { Context } from "hono";
import { user } from "../models/user.js";
import { error } from "console";

export const getAllUsers = async (c: Context) => {
  try {
    const users = await user.find();
    return new Response();
  } catch (error) {
    return c.json({ message: "Error fetching users", error }, 500);
  }
};
