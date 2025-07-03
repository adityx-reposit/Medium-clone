import { PrismaClient } from "@prisma/client/extension";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";
import { Bindings, Variables } from "hono/types";

export const blogRouter = new Hono();

blogRouter.use("/*", async (c, next) => {
  const authHeader = c.req.header("authorization") || " ";
  //@ts-ignore
  const user = await verify(authHeader, c.env.JWT_SECRET);
  if (user) {
    //@ts-ignore
    c.set("userId", user.id);
    await next();
  } else {
    c.status(403);
    return c.json({
      message: "you are not logged in ",
    });
  }
});

blogRouter.post("/", async (c) => {
  const body = await c.req.json();
  //@ts-ignore
  const authorId = await c.get("userId");
  const prisma = new PrismaClient({
    //@ts-ignore
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const blog = await prisma.blog.create({
    data: {
      title: body.title,
      content: body.content,
      authorId: authorId,
    },
  });
  return c.json({
    id: blog.authorId,
  });
});

blogRouter.put("/", async (c) => {
  const body = await c.req.json();
  const prisma = new PrismaClient({
    //@ts-ignore
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const blog = await prisma.blog.update({
    where: {
      id: body.id,
    },
    data: {
      title: body.title,
      content: body.content,
    },
  });
  return c.json({
    id: blog.authorId,
  });
});

blogRouter.get("/", async (c) => {
  const id = c.req.query("id");
  try {
    const prisma = new PrismaClient({
      //@ts-ignore
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const blog = await prisma.blog.findFirst({
      where: {
        id: id,
      },
    });
    return c.json({
      blog,
    });
  } catch (error) {
    c.status(404);
    return c.json({
      error: error,
    });
  }
});

blogRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    //@ts-ignore
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const blogs = await prisma.blog.findMany();
  return c.json({
    blogs,
  });
});
