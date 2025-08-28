import { Hono } from "hono";
import { studentRouter, booksRouter } from "./book.js";
import { bearerAuth } from "hono/bearer-auth";
import { env } from "hono/adapter";

const apiRouter = new Hono();

apiRouter.get("/", (c) => {
  return c.json({ message: "Student API" });
});

apiRouter.use(
  "*",
  bearerAuth({
    verifyToken: async (token, c) => {
      const { API_SECRET } = env<{ API_SECRET: string }>(c);
      return token === API_SECRET;
    },
  })
);

apiRouter.route("/student", studentRouter);
apiRouter.route("/books", booksRouter);

export default apiRouter;
