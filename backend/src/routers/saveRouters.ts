import { Hono } from "hono";
import {
  createSave,
  deleteSave,
  getUserSaves,
} from "../controllers/saveController.js";

const saveRouters = new Hono();
saveRouters.get("/create-save/:postId", createSave);
saveRouters.get("/delete-save/:postId", deleteSave);
saveRouters.get("/get-user-saves", getUserSaves);

export default saveRouters;
