import { Hono } from "hono";
import { createDemoUser, createUser, validateUser } from "../db";
import { signToken } from "../lib/jwt";
import { seedDemoTasks } from "../tasks";

export const auth = new Hono()
  .post("/signup", async (c) => {
    const { username, password } = await c.req.json();

    try {
      const user = await createUser(username, password);
      const token = signToken({ id: user.id });
      return c.json({ token, username: user.username });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      const status = message === "User already exists" ? 409 : 400;
      return c.json({ error: message }, status);
    }
  })

  .post("/login", async (c) => {
    const { username, password } = await c.req.json();

    const user = await validateUser(username, password);
    if (!user) return c.json({ error: "Invalid credentials" }, 401);

    const token = signToken({ id: user.id });
    return c.json({ token, username: user.username, isDemoUser: false });
  })

  .post("/demo", async (c) => {
    const user = await createDemoUser();
    seedDemoTasks(user.id);

    const token = signToken({ id: user.id });

    return c.json({
      token,
      username: user.username,
      isDemoUser: true,
    });
  });
