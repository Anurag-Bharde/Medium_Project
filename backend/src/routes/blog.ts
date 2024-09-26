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
  
  
  
  blogRouter.post('/', (c) => {
    const
    return c.text('Hello Hono!')
  })
  
  blogRouter.put('', (c) => {
    return c.text('Hello Hono!')
  })
  blogRouter.get('/:id', (c) => {
    return c.text('Hello Hono!')
  })
  blogRouter.get('/bulk', (c) => {
    return c.text('Hello Hono!')
  })
