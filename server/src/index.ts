import { auth } from "./routes/auth";
import { createUser } from "./db";
import jwt from "jsonwebtoken";
import { Hono } from "hono";
import { cors } from "hono/cors";
import type { ApiResponse, Task } from "shared/dist";

const SECRET = "super-secret-key";

// Define custom context type with userId
type ContextUser = { userId: string };

// In-memory tasks array
let tasks: Task[] = [
   { id: "1", title: "First Task", completed: false, userId: "user1" },
   { id: "2", title: "Second Task", completed: true, userId: "user2" },
];

// TEMP: seed a test user
(async () => {
   try {
      await createUser("test", "password");
      console.log("Test user created");
   } catch {
      console.log("Test user already exists");
   }
})();

export const app = new Hono<{ Variables: ContextUser }>()

   // CORS middleware (applies to all routes after this line)
   .use("*", cors())

   // Public routes
   .route("/auth", auth)

   // JWT middleware for private routes
   .use("/tasks/*", async (c, next) => {
      const authHeader = c.req.header("Authorization");
      const token = authHeader?.split(" ")[1];

      if (!token) {
         return c.json({ message: "Unauthorized", success: false }, 401);
      }

      try {
         const verified = jwt.verify(token, SECRET);

         if (
            typeof verified === "object" &&
            verified !== null &&
            "id" in verified
         ) {
            const payload = verified as { id: string };
            c.set("userId", payload.id);
            return next();
         } else {
            return c.json({ message: "Invalid token", success: false }, 401);
         }
      } catch {
         return c.json({ message: "Invalid token", success: false }, 401);
      }
   })

   // Test routes
   .get("/", (c) => {
      return c.text("Hello Hono!");
   })

   .get("/hello", async (c) => {
      const data: ApiResponse = {
         message: "Hello BHVR!",
         success: true,
      };

      return c.json(data, { status: 200 });
   })

   // Task routes
   .get("/tasks", (c) => {
      const userId = c.get("userId");
      const userTasks = tasks.filter((t) => t.userId === userId);
      return c.json<Task[]>(userTasks);
   })

   .post("/tasks", async (c) => {
      const { title } = await c.req.json<{ title: string }>();
      const userId = c.get("userId");

      if (!title?.trim()) {
         return c.json(
            { message: "Task title is required", success: false },
            400,
         );
      }

      const newTask: Task = {
         id: String(tasks.length + 1),
         title: title.trim(),
         completed: false,
         userId,
      };

      tasks.push(newTask);
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

      const task = tasks.find((t) => t.id === id && t.userId === userId);
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

      const existing = tasks.find((t) => t.id === id && t.userId === userId);
      if (!existing)
         return c.json(
            { message: "Task not found", success: false },
            { status: 404 },
         );

      tasks = tasks.filter((t) => !(t.id === id && t.userId === userId));
      return c.json({ message: "Task deleted", success: true });
   });

export default app;
