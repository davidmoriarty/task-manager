import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { login, loginDemo } from "../lib/api";

export default function Login({ onLogin }: { onLogin: () => void }) {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await login(username, password);
      onLogin();
      navigate("/");
    } catch {
      setError("Invalid username or password");
    }
  }

  async function handleDemo() {
    try {
      await loginDemo();
      onLogin();
      navigate("/");
    } catch {
      setError("Unable to start demo");
    }
  }

  return (
    <section className="flex min-h-[90vh] items-center justify-center px-4 py-12">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-black lg:text-4xl">Login</h1>
          <p className="text-muted-foreground">Log in to your account</p>
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <div className="space-y-1">
          <label htmlFor="username" className="sr-only">
            Username
          </label>
          <input
            id="username"
            type="text"
            placeholder="Username"
            value={username}
            autoComplete="username"
            onChange={(e) => setUsername(e.target.value)}
            className="h-9 w-full rounded-md border border-border px-3 text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            className="h-9 w-full rounded-md border border-border px-3 text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <div className="space-y-4">
          <Button type="submit" variant="blue" className="w-full">
            Login
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleDemo}
            className="w-full"
          >
            Try Demo
          </Button>
        </div>
      </form>
    </section>
  );
}
