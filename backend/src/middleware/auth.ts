import { Context, Next } from "hono";
import { verify } from "hono/jwt";

export const authMiddleware = async (c: Context, next: Next) => {
  try {
    const authHeader = c.req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      c.status(401);
      return c.json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    const user = await verify(token, c.env.JWT_SECRET, "HS256");

    if (!user || !user.id) {
      c.status(401);
      return c.json({ error: "Unauthorized" });
    }
    console.log("Middleware extracted ID:", user.id); // Check terminal
    c.set("userId", user.id);
    await next();
  } catch (err) {
    c.status(401);
    return c.json({ error: "Invalid or expired token" });
  }
};
