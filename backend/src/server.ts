import app from "./app.js";
import startMongo from "./lib/db.js";
import { serve } from "@hono/node-server";
import initializeSocket from "./socket.js";

const port = 5000;

async function startServer() {
  try {
    await startMongo();
    console.log(`MongoDB bağlantısı başarılı.`);

    const server = serve({ fetch: app.fetch, port: port });
    initializeSocket(server);

    console.log(`Server is running on http://localhost:${port}`);
  } catch (error) {
    console.error("Sunucu başlatılırken hata oluştu:", error);
  }
}

startServer();
