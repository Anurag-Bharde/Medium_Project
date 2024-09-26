import { Hono } from "hono";

import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {sign, verify } from 'hono/jwt'

export const blogRouter=new Hono<{
    Bindings:{
        DATABASE_URL:string,
        JWT_SECRET:string
    }
}>();


blogRouter.use('/*', async(c,next)=>{
    const userHeader=c.req.header('Authentication') || ""
   const headerUse=userHeader.split(" ")[1]
    const response=await verify(headerUse, c.env.JWT_SECRET)
    if(response.id){
      next()
    }else{
      c.status(403)
      return c.json({error:"Unauthorized"})
    }
  })
  
  
  
  blogRouter.post('/', async(c) => {
    const body=await c.req.json();
    const prisma=new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const blog=await prisma.post.create({
        data:{
            title:body.title,
            content:body.content,
            authorId: 1
        }
    })
    return c.json({
        id:blog.id
    })
  })
  
  blogRouter.put('', async(c) => {

  })
  blogRouter.get('/:id', (c) => {
    return c.text('Hello Hono!')
  })
  blogRouter.get('/bulk', (c) => {
    return c.text('Hello Hono!')
  })
