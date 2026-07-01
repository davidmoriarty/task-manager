import { Hono } from "hono";
import { cors } from "hono/cors";
import type { ApiResponse, Task } from "shared";
import { verifyToken } from "./lib/jwt";
import { auth } from "./routes/auth";
import { taskStore } from "./tasks";

// Define custom context type with userId
type ContextUser = { userId: string };

const startedAtMs = Date.now();

export const app = new Hono<{ Variables: ContextUser }>()

  .onError((err, c) => {
    console.error("Hono onError:", {
      method: c.req.method,
      path: c.req.path,
      url: c.req.url,
      message: err instanceof Error ? err.message : String(err),
    });

    return c.json({ error: "Internal Server Error" }, 500);
  })

  .use(
    "*",
    cors({
      origin: [
        "http://localhost:5173",
        "https://task-manager.davidmoriarty.dev",
        "https://task-manager-client.pages.dev",
      ],
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: false,
    }),
  )
  .route("/auth", auth)

  // Info endpoint (non-sensitive)
  .get("/__info", (c) => {
    const uptimeSeconds = Math.floor((Date.now() - startedAtMs) / 1000);
    return c.json({
      name: "task-manager-api",
      mode: "stateless-demo",
      uptimeSeconds,
      nodeEnv: process.env.NODE_ENV ?? "development",
      // Optional: set these in Fly secrets / env if you want them visible
      version: process.env.APP_VERSION ?? null,
      commit: process.env.GIT_SHA ?? null,
    });
  })

  // Test routes
  .get("/", (c) => {
    return c.text("Hello Hono!");
  })
  .get("/hello", async (c) => {
    const data: ApiResponse = { message: "Hello BHVR!", success: true };
    return c.json(data, { status: 200 });
  })

  // JWT middleware for private routes
  .use("/tasks/*", async (c, next) => {
    const authHeader = c.req.header("Authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return c.json({ message: "Unauthorized", success: false }, 401);
    }

    try {
      const payload = verifyToken(token);
      c.set("userId", payload.id);
      await next();
    } catch {
      return c.json({ message: "Invalid token", success: false }, 401);
    }
  })

  // Task routes
  .get("/tasks", (c) => {
    const userId = c.get("userId");
    return c.json(taskStore.tasks.filter((t) => t.userId === userId));
  })

  .post("/tasks", async (c) => {
    const { title } = await c.req.json<{ title: string }>();
    const userId = c.get("userId");

    if (!title?.trim()) {
      return c.json({ message: "Task title is required", success: false }, 400);
    }

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: title.trim(),
      completed: false,
      userId,
    };

    taskStore.tasks.push(newTask);
    return c.json(
      {
        message: "Task created successfully",
        success: true,
      },
      { status: 201 },
    );
  })

  .put("/tasks/:id/toggle", (c) => {
    const id = c.req.param("id");
    const userId = c.get("userId");
    const task = taskStore.tasks.find(
      (t) => t.id === id && t.userId === userId,
    );
    if (!task)
      return c.json(
        { message: "Task not found", success: false },
        { status: 404 },
      );

    task.completed = !task.completed;
    return c.json(
      { message: "Task updated successfully", success: true },
      { status: 200 },
    );
  })

  .delete("/tasks/:id", (c) => {
    const id = c.req.param("id");
    const userId = c.get("userId");

    const before = taskStore.tasks.length;
    taskStore.tasks = taskStore.tasks.filter(
      (t) => !(t.id === id && t.userId === userId),
    );

    if (taskStore.tasks.length === before) {
      return c.json(
        { message: "Task not found", success: false },
        { status: 404 },
      );
    }

    return c.json({ message: "Task deleted", success: true });
  });
