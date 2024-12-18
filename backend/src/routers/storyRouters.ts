import { Hono } from "hono";
import {
  createStory,
  getAllStories,
  deleteStory,
  getUserStories,
  getFollowingStories,
} from "../controllers/storyController.js";
import { uploadFile } from "../middlewares/uploadFile.js";

const storyRouters = new Hono();

storyRouters.post("/create-story", uploadFile, createStory);
storyRouters.get("/delete-story/:storyId", deleteStory);
storyRouters.get("/get-user-stories/:userId", getUserStories);
storyRouters.get("/get-all-stories", getAllStories);
storyRouters.get("/get-following-stories", getFollowingStories);

export default storyRouters;
