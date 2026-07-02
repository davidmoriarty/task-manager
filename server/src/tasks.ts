// server/src/tasks.ts
import type { Task } from "shared";

export const taskStore = {
  tasks: [] as Task[],
};

export function seedDemoTasks(userId: string) {
  taskStore.tasks.push(
    {
      id: crypto.randomUUID(),
      title: "Review project roadmap",
      completed: false,
      userId,
    },
    {
      id: crypto.randomUUID(),
      title: "Implement demo mode",
      completed: true,
      userId,
    },
    {
      id: crypto.randomUUID(),
      title: "Deploy latest changes",
      completed: false,
      userId,
    },
    {
      id: crypto.randomUUID(),
      title: "Test mobile layout",
      completed: false,
      userId,
    },
  );
}
