import { Hono } from "hono";
import authRouters from "./routers/authRouters.js";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import userRouters from "./routers/userRouters.js";
import { sendResponse } from "./lib/sendResponse.js";
import { errorHandler } from "./lib/errorHandler.js";
import {
  checkBearerToken,
  checkUserRole,
} from "./middlewares/AuthMiddleware.js";
import connectionRouters from "./routers/connectionRouters.js";

//*configuration
const app = new Hono().basePath("/api");
app.use(cors());
app.use(prettyJSON());
app.onError((err, c) => {
  return errorHandler(err, c);
});
app.notFound((c) => {
  return sendResponse(c, 404, "API bulunamadı");
});

//* Routes
app.get("/", (c) => {
  return c.text("Welcome to Zygo!");
});
app.route("/auth", authRouters);

//* Default routes ---------
app.use(checkBearerToken);
app.route("/connection", connectionRouters);

export default app;
