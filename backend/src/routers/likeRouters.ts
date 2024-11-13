import { Hono } from "hono";
import {
  createLike,
  deleteLike,
  getPostLikes,
} from "../controllers/likeController.js";

const likeRouters = new Hono();
likeRouters.post("/create-like", createLike);
likeRouters.get("/delete-like/:postId", deleteLike);
likeRouters.get("/get-post-likes/:postId", getPostLikes);

export default likeRouters;
