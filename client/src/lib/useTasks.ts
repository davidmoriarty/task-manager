import type { Task } from "@shared";
import { useQuery } from "@tanstack/react-query";
import { getTasks } from "./api";

export const useTasks = () =>
  useQuery<Task[], Error>({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });
