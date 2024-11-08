import { Hono } from "hono";
import {
  createPost,
  deletePost,
  getAllPosts,
  getUserPosts,
  updatePost,
} from "../controllers/postController.js";

const postRouters = new Hono();

postRouters.post("/create-post", createPost);
postRouters.post("/update-post/:postId", updatePost);
postRouters.post("/delete-post/:postId", deletePost);
postRouters.post("/get-user-posts/:userId", getUserPosts);
postRouters.post("/get-all-posts", getAllPosts);
postRouters.post("/get-by-postId/:postId", getAllPosts);

export default postRouters;
