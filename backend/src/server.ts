import app from "./app.js";
import { serve } from "@hono/node-server";
import initializeSocket from "./socket.js";
import startMongo from "./lib/db.js";

const server = serve({ fetch: app.fetch });
initializeSocket(server);
await startMongo();

console.log(`Server is running http://localhost:3000`);
