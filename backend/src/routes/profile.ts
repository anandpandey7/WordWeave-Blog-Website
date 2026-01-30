import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';
import { PrismaClient } from '../../src/generated/prisma/edge'
import { withAccelerate } from "@prisma/extension-accelerate";


type Bindings = {
  DATABASE_URL: string,
  JWT_SECRET: string
}

export const profileRouter = new Hono<{ Bindings: Bindings, 
    Variables:{
        userId: string,
    }
}>();


// profileRouter.use("/*", authMiddleware);
profileRouter.get("/me", authMiddleware, async (c) => {
    const prisma = new PrismaClient({
    accelerateUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const userId = c.get("userId");

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        posts: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            title: true,
            content: true,
            published: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      c.status(404);
      return c.json({ error: "User not found", debugId: userId });
    }

    return c.json({
      success: true,
      profile: user,
    });
  } catch (e) {
    c.status(500);
    return c.json({ error: "Failed to fetch profile" });
  }
});

profileRouter.get("/:id", async (c) => {
    const prisma = new PrismaClient({
    accelerateUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const userId = c.req.param("id");

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        posts: {
          where: { published: true },
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            title: true,
            content: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      c.status(404);
      return c.json({ error: "User not found" });
    }

    return c.json({
      success: true,
      profile: user,
    });
  } catch (e) {
    c.status(500);
    return c.json({ error: "Failed to fetch profile" });
  }
});