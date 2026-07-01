import { useState } from "react";
import { useNavigate } from "react-router";
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
    <section className="min-h-[90vh] flex flex-col items-center justify-center gap-4 py-16">
      <div className="container mx-auto px-8">
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center space-y-5">
          <div className="w-full mx-auto">
            <h1 className="text-3xl lg:text-4xl text-center font-black leading-relaxed">
              Login
            </h1>
            <p className="text-lg font-medium text-center text-muted-foreground">
              Log in to your account
            </p>
          </div>

          <div className="w-full max-w-2xl mx-auto">
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>

          <form
            onSubmit={handleSubmit}
            className="w-full max-w-2xl mx-auto space-y-6"
          >
            <div className="w-full mx-auto">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full text-slate-800 border rounded px-3 py-2 border-slate-400"
              />
            </div>

            <div className="w-full mx-auto">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-slate-800 border rounded px-3 py-2 border-slate-400"
              />
            </div>

            <div className="w-full mx-auto mb-3">
              <button
                type="submit"
                className="w-full bg-sky-500 hover:bg-sky-600 text-white rounded py-2 font-medium"
              >
                Login
              </button>
            </div>

            <div className="w-full mx-auto">
              <button
                type="button"
                onClick={handleDemo}
                className="w-full border border-slate-300 hover:bg-slate-100 rounded py-2 font-medium"
              >
                Try Demo
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
