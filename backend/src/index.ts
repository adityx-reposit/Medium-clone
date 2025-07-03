import { Hono } from "hono";


const app = new Hono();
//home component
app.get("/", (c) => {
  return c.text("Hello Hono!");
});



app.post("/api/v1/signin",(c)=>{
  return c.text("post the sign in")
})
app.post("/api/v1/signup",(c)=>{
  return c.text("post the sign up ")
})
app.post("/api/v1/blogs",(c)=>{
  return c.text("post the blog info ")
})
app.put("/api/v1/blogs",(c)=>{
  return c.text("update the blog info ")
})
// Fix the typo in the route path for getting blogs
app.get("/api/blogs/:id", (c) => {
  return c.text("get blogs");
});






export default app;
