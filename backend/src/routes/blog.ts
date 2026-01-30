import { Hono } from 'hono';
import { PrismaClient } from '../../src/generated/prisma/edge'
import { withAccelerate } from "@prisma/extension-accelerate";
import { authMiddleware } from '../middleware/auth';
import { createBlogInput, updateBlogInput} from '@anandcse/blog-common';


type Bindings = {
  DATABASE_URL: string,
  JWT_SECRET: string
}

export const blogRouter = new Hono<{ Bindings: Bindings, 
    Variables:{
        userId: string,
    }
}>();

blogRouter.use("/*", authMiddleware);

// GET /api/v1/blog/bulk?page=1&limit=10

blogRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    accelerateUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    // reading query
    const page = Number(c.req.query("page") || 1);
    const limit = Number(c.req.query("limit") || 10);

    // validation -- suggested by Multi-modal model(ChatGPT)
    const safePage = page > 0 ? page : 1;
    const safeLimit = limit > 0 && limit <= 50 ? limit : 10;

    const skip = (safePage - 1) * safeLimit;

    // 3️⃣ Fetch paginated posts
    const posts = await prisma.post.findMany({
        where: {
            published: true,
        },
      skip,
      take: safeLimit,
      orderBy: {
        createdAt: "desc", // ← order by newest
      },
      select: {
        id: true,
        title: true,
        content: true,
        authorId: true,
        createdAt: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    // 4️⃣ Total count (for frontend)
    const totalPosts = await prisma.post.count({
        where: {published: true},
    });

    return c.json({
      success: true,
      pagination: {
        page: safePage,
        limit: safeLimit,
        totalPosts,
        totalPages: Math.ceil(totalPosts / safeLimit),
      },
      posts,
    });
  } catch (error) {
    c.status(500);
    return c.json({
      success: false,
      message: "Failed to fetch posts",
    });
  } 
//   finally {
//     await prisma.$disconnect()
//   }
});

blogRouter.get("/:id", async (c)=>{
    const prisma = new PrismaClient({
        accelerateUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    try{
        const id = c.req.param("id");

        const post = await prisma.post.findUnique({
            where: {
                id: id,
            },
            select: {
                id: true,
                title: true,
                content: true,
                published: true,
                authorId: true,
                createdAt: true,
                author: {
                    select: {
                        name: true
                    }
                }
            }
        });
        if (!post) {
            c.status(404);
            return c.json({ message: "Post not found" });
        }

        return c.json({
            success: true,
            post,
        });
    }catch(error){
        c.status(500);
        return c.json({
        success: false,
        message: "Failed to fetch post",
        });
    }
    // finally {
    //     await prisma.$disconnect()
    // }
})

blogRouter.post('/', async(c)=>{
    const prisma = new PrismaClient({
        accelerateUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    try{
        const body = await c.req.json();
        const parseResult = createBlogInput.safeParse(body);
        if(!parseResult.success){
            c.status(400);
            return c.json({ success: false, message: "Invalid input" })
        }
        const bodyData = parseResult.data;


        const userId = c.get("userId");
        const post = await prisma.post.create({
            data: {
                title: bodyData.title,
                content: bodyData.content || "",
                published: bodyData.published || false,
                authorId: userId,
            }
        })
        
        return c.json({
            success: true,
            id: post.id
        })
    } catch(error){
        c.status(500);
        return c.json({
        success: false,
        error,
         message: "Failed to create posts"});
    }
    // finally {
    //     await prisma.$disconnect()
    // }
})
// patch for updating for publishing

blogRouter.patch("/publish", authMiddleware, async (c) => {
    const prisma = new PrismaClient({
        accelerateUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
  try {
        const body = await c.req.json();

        if (!body?.id) {
        c.status(400);
        return c.json({
            success: false,
            message: "Post id is required",
        });
        }

        const userId = c.get("userId") as string;

        const result = await prisma.post.updateMany({
        where: {
            id: body.id,
            authorId: userId,
        },
        data: {
            published: true,
        },
        });

        if (result.count === 0) {
        c.status(404);
        return c.json({
            success: false,
            message: "Post not found or not authorized",
        });
        }

        return c.json({
        success: true,
        message: "Post published successfully",
        });
    } catch (error) {
        console.error(error);
        c.status(500);
        return c.json({
        success: false,
        message: "Failed to publish post",
        });
    }
});


// Error: show 500 when post to update not exist  -- resolved used updateMany intead of update , lasttly I have to do 2 DB calls
blogRouter.put('/',async(c)=>{
    const prisma = new PrismaClient({
        accelerateUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const body = await c.req.json();

        const parseResult = updateBlogInput.safeParse(body);
        if (!parseResult.success) {
        c.status(400);
        return c.json({ success: false, message: "Invalid input" });
        }

        const bodyData = parseResult.data;
        const userId = c.get("userId") as string;

        // 1️⃣ Check ownership + existence
        const existingPost = await prisma.post.findFirst({
        where: {
            id: bodyData.id,
            authorId: userId,
        },
        });

        if (!existingPost) {
        c.status(404);
        return c.json({
            success: false,
            message: "Post not exist or not authorized",
        });
        }

        // 2️⃣ Update
        const updatedPost = await prisma.post.update({
        where: { id: bodyData.id },
        data: {
            title: bodyData.title,
            content: bodyData.content,
            published: bodyData.published || false,
        },
        select: {
            id: true,
            title: true,
            content: true,
            published: true,
            createdAt: true,
        },
        });

        // 3️⃣ Return updated data
        return c.json({
            success: true,
            post: updatedPost,
        });
    } catch (error) {
        console.error(error);
        c.status(500);
        return c.json({
        success: false,
        message: "Failed to update post",
        });
    }
})

blogRouter.delete('/:id', async(c)=>{
    const prisma = new PrismaClient({
        accelerateUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    try{
        const id = c.req.param("id");
        const userId = c.get("userId");
        const post = await prisma.post.deleteMany({
            where: {
                id: id,
                authorId: userId
            }
        });
        if(post.count === 0){
            c.status(404)
            return c.json({success: false,
            message: 'Post not exist or not authoerized'})
        }
        return c.json({
            success: true,
            message: 'Post deleted successfully'
        })
    }catch(error){
        c.status(500)
        return c.json({ success: false,
        message: 'Failed to delete post'})
    }
})