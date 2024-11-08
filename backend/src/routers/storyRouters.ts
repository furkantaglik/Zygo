import { Hono } from "hono";
import {
  createStory,
  getAllStories,
  deleteStory,
  getUserStories,
} from "../controllers/storyController.js";

const storyRouters = new Hono();

storyRouters.post("/create-story", createStory);
storyRouters.delete("/delete-story/:storyId", deleteStory);
storyRouters.get("/get-user-stories/:userId", getUserStories);
storyRouters.get("/get-all-stories", getAllStories);

export default storyRouters;
