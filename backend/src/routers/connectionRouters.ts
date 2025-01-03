import { Hono } from "hono";
import {
  acceptRequest,
  rejectRequest,
  removeFollower,
  sendRequest,
  unfollow,
  getFollowers,
  getFollowing,
  getConnectionStatuses,
} from "../controllers/connectionController.js";

const connectionRouters = new Hono();

connectionRouters.get("/send-request/:receiverId", sendRequest);
connectionRouters.get("/accept-request/:requestId", acceptRequest);
connectionRouters.get("/reject-request/:requestId", rejectRequest);
connectionRouters.get("/unfollow/:userId", unfollow);
connectionRouters.get("/remove-follower/:userId", removeFollower);

connectionRouters.get("/get-requests-details", getConnectionStatuses);
connectionRouters.get("/get-followers/:userId", getFollowers);
connectionRouters.get("/get-following/:userId", getFollowing);

export default connectionRouters;
