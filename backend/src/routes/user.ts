import { Hono } from "hono";

import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {sign, verify } from 'hono/jwt'

 export const userRouter=new Hono<{
    Bindings:{
        DATABASE_URL:string,
        JWT_SECRET:string
    }
  }>();

  userRouter.post('/api/v1/signin',async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl:c.env.DATABASE_URL,
    }).$extends(withAccelerate());

  
    const body=await c.req.json();
     const user=await prisma.user.findUnique({
      where:{
        email:body.email,
        password:body.password,
        name:body.name
      }
     })
     if(!user){
      c.status(403)
      return c.json({msg:"USER NOT FOUND"})
     }
  
     const jwt=await sign({id:user.id},c.env.JWT_SECRET)
     return c.json({jwt});
  })
  
  userRouter.post('/api/v1/signup',async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl:c.env.DATABASE_URL,
    }).$extends(withAccelerate());
  
    const body=await c.req.json();
    
    const user=await prisma.user.create({
      data: {
      email: body.email,
      password: body.password,
      name:body.name
      },
      
    })
    const token=await sign({id:user.id},c.env.JWT_SECRET)
    c.res.headers.append('Authentication',token)
    return c.json({
      json:token
    })
  })
