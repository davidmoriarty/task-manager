import { useState } from "react";
import { useNavigate } from "react-router";
import { login } from "../lib/api";

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

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

  return (
    <section className="py-24">
      <div className="container mx-auto px-8">
        <div className="py-8 text-center">
          <h1 className="text-3xl lg:text-4xl text-center font-black leading-relaxed">
            Login
          </h1>
          <p className="text-lg font-medium text-center text-muted-foreground">
            Log in to your account
          </p>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="w-full mx-auto">
          <div className="w-ful mx-auto max-w-4xl flex flex-col items-center justify-center gap-5">
            <div className="w-full mx-auto">
              <label htmlFor="username" className="text-slate-800 sr-only">
                Username
              </label>
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
              <label htmlFor="password" className="text-slate-800 sr-only">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-slate-800 border rounded px-3 py-2 border-slate-400"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-sky-500 hover:bg-sky-600 text-white rounded py-2 font-medium"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
