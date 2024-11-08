import { Hono } from "hono";
import {
  createLike,
  deleteLike,
  getPostLikes,
} from "../controllers/likeController.js";

const likeRouters = new Hono();
likeRouters.post("/create-like", createLike);
likeRouters.post("/delete-like/:commentId", deleteLike);
likeRouters.post("/get-post-likes/:postId", getPostLikes);

export default likeRouters;
