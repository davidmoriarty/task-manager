import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App.tsx";

const APP_PREFIX = "[APP]";

(["log", "warn", "error", "info"] as const).forEach((method) => {
   const original = (console[method] as any).bind(console);
   (console[method] as any) = (...args: any[]) => {
      if (args.length > 0 && typeof args[0] === "string") {
         original(`${APP_PREFIX} ${args[0]}`, ...args.slice(1));
      } else {
         original(APP_PREFIX, ...args);
      }
   };
});

const queryClient = new QueryClient();

const rootElement = document.getElementById("root");

if (!rootElement) {
   throw new Error(
      "Root element not found. Check if it's in your index.html or if the id is correct.",
   );
}
createRoot(rootElement).render(
   <StrictMode>
      <QueryClientProvider client={queryClient}>
         <App />
      </QueryClientProvider>
   </StrictMode>,
);
