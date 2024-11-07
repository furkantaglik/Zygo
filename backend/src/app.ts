import { Hono } from "hono";
import authRouters from "./routers/authRouters.js";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import { HTTPException } from "hono/http-exception";
import userRouters from "./routers/userRouters.js";

//*configuration
const app = new Hono().basePath("/api");
app.use(cors());
app.use(prettyJSON());
app.notFound((c) => {
  return c.json({ message: "api noktası bulunamadı" }, 404);
});

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  return c.json({ message: "Beklenmedik bir hata oluştu" }, 500);
});

//* Routes
app.get("/", (c) => {
  return c.text("Hello Zygo!");
});

app.route("/auth", authRouters);
app.route("/user", userRouters);

export default app;
