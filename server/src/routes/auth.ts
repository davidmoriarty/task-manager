import { Hono } from "hono";
import jwt from "jsonwebtoken";
import { createUser, validateUser } from "../db";

const SECRET = "super-secret-key";

export const auth = new Hono()

  .post("/signup", async (c) => {
    const { username, password } = await c.req.json();
    try {
      const user = await createUser(username, password);
      const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: "1h" });
      return c.json({ token, username: user.username });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      return c.json({ error: message }, 400);
    }
  })

  .post("/login", async (c) => {
    const { username, password } = await c.req.json();
    const user = await validateUser(username, password);
    if (!user) return c.json({ error: "Invalid credentials" }, 401);
    const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: "1h" });
    return c.json({ token, username: user.username });
  });
