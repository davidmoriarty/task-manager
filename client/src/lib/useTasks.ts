import type { Task } from "@shared";
import { useQuery } from "@tanstack/react-query";

const fetchTasks = async (): Promise<Task[]> => {
  const res = await fetch("http://localhost:3000/tasks");
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
};

export const useTasks = () =>
  useQuery<Task[], Error>({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });
