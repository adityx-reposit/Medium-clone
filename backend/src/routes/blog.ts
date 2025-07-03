import { Hono } from "hono";

export const blogRouter= new Hono();

app.post("/api/v1/blogs", (c) => {
    return c.text("post the blog info");
  });
  
  app.put("/api/v1/blogs", (c) => {
    return c.text("update the blog info");
  });
  
  app.get("/api/blogs/:id", (c) => {
    return c.text("get blogs");
  });