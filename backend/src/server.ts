import { serve } from "@hono/node-server";
import app from "./app.js";
import runMongo from "./lib/db.js";

const port = 5000;

async function startServer() {
  try {
    await runMongo();
    console.log(`Server is running on http://localhost:${port}`);

    serve({
      fetch: app.fetch,
      port,
    });
  } catch (error) {
    console.error("Sunucu başlatılırken hata oluştu:", error);
  }
}

startServer();
