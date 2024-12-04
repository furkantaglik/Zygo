import { Hono } from "hono";
import {
  createPost,
  deletePost,
  getAllPosts,
  getByPostId,
  getUserPosts,
  updatePost,
} from "../controllers/postController.js";
import { uploadFile } from "../middlewares/uploadFile.js";

const postRouters = new Hono();

postRouters.post("/create-post", uploadFile, createPost);
postRouters.post("/update-post", updatePost);
postRouters.get("/delete-post/:postId", deletePost);
postRouters.get("/get-user-posts/:userId", getUserPosts);
postRouters.get("/get-all-posts", getAllPosts);
postRouters.get("/get-by-postId/:postId", getByPostId);

export default postRouters;
