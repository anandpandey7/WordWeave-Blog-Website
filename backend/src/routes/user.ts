import { Hono } from 'hono';
import bcrypt from "bcryptjs";
import { decode, jwt, sign, verify } from 'hono/jwt';
import { PrismaClient } from '../../src/generated/prisma/edge'
import { withAccelerate } from "@prisma/extension-accelerate";
import {signupInput, signinInput } from '@anandcse/blog-common';
import { authMiddleware } from '../middleware/auth';

type Bindings = {
  DATABASE_URL: string,
  JWT_SECRET: string
}

export const userRouter = new Hono<{ Bindings: Bindings }>();

userRouter.post('/signup', async(c)=>{
  const prisma = new PrismaClient({
    accelerateUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const body = await c.req.json()

    const validation = signupInput.safeParse(body);
    if (!validation.success) {
      c.status(400)
      return c.json({ success: false, message: "Invalid input", errors: validation.error.format() })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      c.status(409);
      return c.json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const user = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name,
        password: hashedPassword,
      },
    })
    console.log(user);

    const token = await sign(
    {
        id: user.id,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 *12,
    },c.env.JWT_SECRET);

    return c.json({ success: true, token})
  } catch (e) {
    c.status(500);
    return c.json({ error: "Error while signing up" })
  } 
//   finally {
//     // Optional: In some edge cases, you might want to disconnect, 
//     // though Prisma handles pooling well with Accelerate.
//     await prisma.$disconnect()
//   }
})

userRouter.post('/signin', async(c)=>{
  const prisma = new PrismaClient({
    accelerateUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const body = await c.req.json()

    const validation = signinInput.safeParse(body);
    if (!validation.success) {
      c.status(400)
      return c.json({ success: false, message: "Invalid input", errors: validation.error.format() })
    }

    if (!body.email || !body.password) {
      c.status(400)
      return c.json({ success: false, message: "Missing fields" })
    }

    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    })

    if(!user){
      c.status(404);
      return c.json({success: false,
        message: "User not found"
      })
    }

    const isValid = await bcrypt.compare(body.password, user.password);

    if(!isValid){
      c.status(401);
      return c.json({success: false,
        message: "Wrong Password"
      })
    }

    const token = await sign(
    {
        id: user.id,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 *12,
    },c.env.JWT_SECRET);

    return c.json({ success: true, token})
  } catch (e) {
    c.status(500);
    return c.json({ error: "Error while signing up" })
  } 
//   finally {
//     // Optional: In some edge cases, you might want to disconnect, 
//     // though Prisma handles pooling well with Accelerate.
//     await prisma.$disconnect()
//   }
})

userRouter.get("/verifyToken", authMiddleware, (c) => {
  return c.json({ success: true });
});
