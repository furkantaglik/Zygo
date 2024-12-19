import { handle } from "hono/vercel";
import app from "../dist/app.js";

export const runtime = "edge";

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const PUT = handle(app);
export const OPTIONS = handle(app);
