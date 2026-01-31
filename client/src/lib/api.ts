// client/src/lib/api.ts
import type { Task } from "@shared";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

// Helper to include token in requests
export async function authFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  if (!res.ok) throw new Error(`Request failed: ${res.status}`);

  return res.json() as Promise<T>;
}

// Login function
export async function login(username: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    throw new Error(`Login failed: ${res.status}`);
  }

  const data = await res.json();
  localStorage.setItem("token", data.token);
  return data;
}

// Task API functions
export function getTasks() {
  return authFetch<Task[]>("/tasks");
}

export function createTask(title: string) {
  return authFetch<{ message: string; success: boolean }>("/tasks", {
    method: "POST",
    body: JSON.stringify({ title }),
  });
}

export function toggleTask(id: string) {
  return authFetch<{ message: string; success: boolean }>(
    `/tasks/${id}/toggle`,
    {
      method: "PUT",
    },
  );
}

export function deleteTask(id: string) {
  return authFetch<{ message: string; success: boolean }>(`/tasks/${id}`, {
    method: "DELETE",
  });
}
