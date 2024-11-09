import { Hono } from "hono";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import { sendResponse } from "./lib/utils/sendResponse.js";
import { errorHandler } from "./lib/utils/errorHandler.js";
import { checkBearerToken } from "./middlewares/AuthMiddleware.js";
import authRouters from "./routers/authRouters.js";
import connectionRouters from "./routers/connectionRouters.js";
import postRouters from "./routers/postRouters.js";
import storyRouters from "./routers/storyRouters.js";
import commentRouters from "./routers/commentRouters.js";
import likeRouters from "./routers/likeRouters.js";

//* configuration
const app = new Hono().basePath("/api");
app.use(cors());
app.use(prettyJSON());
app.onError((err, c) => {
  return errorHandler(err, c);
});
app.notFound((c) => {
  return sendResponse(c, 404, "API bulunamadı");
});

//* Routes -----------------
app.get("/", (c) => {
  return c.text("Welcome to Zygo!");
});
app.route("/auth", authRouters);

//* Default routes ---------
app.use(checkBearerToken);
app.route("/connection", connectionRouters);
app.route("/post", postRouters);
app.route("/story", storyRouters);
app.route("/comment", commentRouters);
app.route("/like", likeRouters);

export default app;
