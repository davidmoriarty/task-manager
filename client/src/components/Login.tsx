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
      <div className="w-full max-w-screen-lg mx-auto flex flex-1 flex-col items-center justify-center gap-y-12">
         <h1 className="text-2xl font-bold mb-8">Login</h1>
         {error && <p className="text-red-500 text-sm">{error}</p>}
         <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
            <label htmlFor="username" className="text-slate-800 sr-only">
               Username
            </label>
            <input
               id="username"
               type="text"
               placeholder="Username"
               value={username}
               onChange={(e) => setUsername(e.target.value)}
               className="text-slate-800 border rounded px-3 py-2 border-slate-400"
            />
            <label htmlFor="password" className="text-slate-800 sr-only">
               Password
            </label>
            <input
               id="password"
               type="password"
               placeholder="Password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               className="text-slate-800 border rounded px-3 py-2 border-slate-400"
            />
            <button
               type="submit"
               className="bg-blue-600 hover:bg-blue-700 text-white rounded py-2 font-medium"
            >
               Login
            </button>
         </form>
      </div>
   );
}
