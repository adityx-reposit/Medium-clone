import { Hono } from "hono";
import { Prisma, PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { decode,sign ,verify } from "hono/jwt";
import { Bindings } from "hono/types";


export const userRouter =new Hono()


userRouter.post("/api/v1/signin", async(c) => {
    const body  = await c.req.json() ;
    const prisma = new PrismaClient({
      //@ts-ignore
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
  
    const response =await prisma.user.findFirst({
      where:{
        email:body.email,
        password:body.password
      }
  
    })
    if(response){
       const jwt = await sign({
        response:response.id
        //@ts-ignore
      },c.env.JWT_SECRET)
       return c.json({jwt})
    } 
    else{
      c.status(403);
      return c.text("invalid credentials")
    }
  });
  
  userRouter.post("/api/v1/signup", async (c) => {
    const body = await c.req.json();
    
    const prisma = new PrismaClient({
      //@ts-ignore
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
  
    try {
   const user= await prisma.user.create({
        data: {
          email: body.email,
          password: body.password,
          name: body.name
        }
      });
      const token = await sign({
        id: user.id,
        //@ts-ignore
      }, c.env.JWT_SECRET);
  
      return c.json({ token });
  
    } catch (error: any) {
      // Check if the error is about the missing table
      return c.text(error)
      
    }
  
  
  
  });