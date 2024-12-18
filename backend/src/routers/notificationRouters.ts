import { Hono } from "hono";
import {
  getUserNotifications,
  markAllNotificationsAsRead,
} from "../controllers/notificationController.js";

const notificationRouters = new Hono();

notificationRouters.get("/get-user-notifications", getUserNotifications);
notificationRouters.get(
  "/mark-all-notification-as-read",
  markAllNotificationsAsRead
);

export default notificationRouters;
