import type { Task } from "@shared/index";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createTask, deleteTask, getTasks, toggleTask } from "@/lib/api";

export default function Home({ isDemoUser }: { isDemoUser: boolean }) {
  const queryClient = useQueryClient();
  const [newTitle, setNewTitle] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);
  const [showDemoNotice, setShowDemoNotice] = useState(isDemoUser);

  // Fetch tasks
  const { data: tasks, isLoading } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  // Create task
  const createTaskMutation = useMutation({
    mutationFn: (title: string) => createTask(title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setNewTitle("");
    },
  });

  // Toggle task completion
  const toggleTaskMutation = useMutation({
    mutationFn: (id: string) => toggleTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  // Delete task
  const deleteTaskMutation = useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col items-center justify-center gap-y-3 p-4">
      <div className="container mx-auto mb-4 pt-4 pb-8">
        <h1 className="text-2xl lg:text-4xl text-center font-semibold lg:font-black leading-relaxed">
          Task List
        </h1>
        <p className="text-lg font-medium text-center text-muted-foreground">
          Manage your tasks efficiently.
        </p>
      </div>

      {isDemoUser && showDemoNotice && (
        <div
          className="container mx-auto max-w-5xl rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 mb-10 text-amber-950 shadow-sm"
          role="note"
          aria-label="Demo mode notice"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="text-sm">
              <p>
                <strong>Demo mode:</strong> This is a temporary demo workspace.
              </p>
              <p>Please don't enter sensitive information.</p>
            </div>

            <button
              type="button"
              onClick={() => setShowDemoNotice(false)}
              className="shrink-0 rounded px-2 text-lg leading-none text-amber-950 hover:bg-amber-100"
              aria-label="Dismiss notice"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Display error message */}
      {inputError && (
        <div
          key={inputError} // helps React restart animation on each new error
          className={`bg-rose-200 w-full h-12 flex items-center rounded px-4 -mb-8 shadow-sm transition-opacity duration-500 ${
            inputError ? "opacity-100 animate-in fade-in zoom-in" : "opacity-0"
          }`}
        >
          <p className="text-rose-500 text-md">{inputError}</p>
        </div>
      )}

      {/* Task input */}
      <div className="w-full h-12 container mx-auto flex flex-col items-center justify-center gap-y-4 md:flex-row md:justify-between md:gap-x-4 px-4 mb-8">
        <label htmlFor="task-input" className="sr-only">
          New Task
        </label>
        <input
          id="task-input"
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Add a new task"
          className="w-full h-full border py-4 px-4 rounded border-slate-400"
        />
        <Button
          className="w-full md:w-[30%] h-full bg-sky-600 hover:bg-sky-500 transition-colors duration-150"
          onClick={() => {
            if (newTitle.trim() === "") {
              setInputError("Task title cannot be empty");
              setTimeout(() => {
                // Trigger fade-out first
                const fadeDuration = 1000;
                setInputError((prev) => prev && ""); // triggers opacity change
                setTimeout(() => setInputError(null), fadeDuration);
              }, 2000);
              return;
            }
            createTaskMutation.mutate(newTitle);
          }}
        >
          Add Task
        </Button>
      </div>

      {/* Task list */}
      <div className="container mx-auto px-4">
        {isLoading ? (
          <p>Loading tasks...</p>
        ) : (
          <ul className="mt-6 w-full">
            {tasks?.map((task) => (
              <li
                key={task.id}
                className={`p-3 mb-3 rounded-md border flex justify-between items-center transition-colors duration-150 ${
                  task.completed
                    ? "line-through bg-slate-200 dark:bg-slate-600 text-slate-500"
                    : "bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700"
                }`}
              >
                <span>{task.title}</span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => toggleTaskMutation.mutate(task.id)}
                  >
                    Toggle
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      if (
                        window.confirm(
                          `Are you sure you want to delete "${task.title}"?`,
                        )
                      ) {
                        deleteTaskMutation.mutate(task.id);
                      }
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
