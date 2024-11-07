import type { Context } from "hono";
import { User } from "../models/user.js";
import { sendResponse } from "../lib/sendResponse.js";

export const getAllUsers = async (c: Context) => {
  const users = await User.find();
  return sendResponse(c, 200, null, users);
};
