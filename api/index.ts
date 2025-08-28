import { Hono } from "hono";
import { cors } from "hono/cors";
import apiRouter from "./routes/api.js";
import { handle } from "hono/vercel";

const app = new Hono().basePath("/api");

const allowList = [
  "https://iot-lab2.vercel.app", // โปรดใส่โดเมน frontend ของคุณ
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

app.use(
  "*",
  cors({
    origin: (origin) => (origin && allowList.includes(origin) ? origin : ""),
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Authorization", "Content-Type"],
    maxAge: 86400,
  })
);

app.route("/v1", apiRouter);

export const config = { runtime: "edge" };
export default handle(app);
