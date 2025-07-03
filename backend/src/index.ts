import { Hono } from "hono";
import { userRouter } from "../src/routes/user";
import { blogRouter } from "./routes/blog";
import { Prisma, PrismaClient } from "@prisma/client/edge";

const app = new Hono();

app.route("/api/v1", userRouter);
app.route("/api/v1/blog", blogRouter);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default app;
