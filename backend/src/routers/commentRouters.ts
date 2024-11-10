import { Hono } from "hono";
import {
  createComment,
  deleteComment,
  getCommentsByPostId,
  updateComment,
} from "../controllers/commentController.js";

const commentRouters = new Hono();
commentRouters.post("/create-comment", createComment);
commentRouters.post("/update-comment", updateComment);
commentRouters.get("/delete-comment/:commentId", deleteComment);
commentRouters.get("/get-post-comments/:postId", getCommentsByPostId);

export default commentRouters;
