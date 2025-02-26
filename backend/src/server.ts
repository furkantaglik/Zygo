import app from "./app.js";
import { serve } from "@hono/node-server";
import initializeSocket from "./socket.js";
import startMongo from "./lib/db.js";

const PORT = 5000; 

const server = serve({ fetch: app.fetch, port: PORT });
initializeSocket(server);
await startMongo();

console.log(`Server is running http://localhost:${PORT}`);
