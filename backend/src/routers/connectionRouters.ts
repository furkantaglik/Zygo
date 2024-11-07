import { Hono } from "hono";
import {
  acceptRequest,
  rejectRequest,
  removeFollower,
  sendRequest,
  unfollow,
  getRequests,
  getFollowers,
  getFollowing,
} from "../controllers/connectionController.js";

const connectionRouters = new Hono();

connectionRouters.post("/send-request/:receiverId", sendRequest);
connectionRouters.post("/accept-request/:requestId", acceptRequest);
connectionRouters.post("/reject-request/:requestId", rejectRequest);
connectionRouters.get("/unfollow/:userId", unfollow);
connectionRouters.get("/remove-follower/:userId", removeFollower);

connectionRouters.get("/get-requests", getRequests);
connectionRouters.get("/get-followers", getFollowers);
connectionRouters.get("/get-following", getFollowing);

export default connectionRouters;
