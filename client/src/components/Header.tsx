// client/src/components/Header.tsx
import { useNavigate } from "react-router";

type HeaderProps = {
  token: string | null;
  username: string;
  isDemoUser: boolean;
  onLogout: () => void;
};

export default function Header({
  token,
  username,
  isDemoUser,
  onLogout,
}: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 inset-x-0 z-40 py-2.5 lg:py-4 bg-slate-200 text-slate-900 dark:bg-slate-900 dark:text-slate-50">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Brand */}
        <a href="/" className="text-lg font-bold">
          Task Manager
        </a>

        {/* Nav links */}
        <nav className="flex flex-row items-center justify-end gap-4">
          {token ? (
            <>
              <span>{isDemoUser ? "Demo User" : username}</span>

              <button
                type="button"
                onClick={onLogout}
                className="bg-red-600 hover:bg-red-500 text-white px-4 py-1 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-1 rounded"
            >
              Login
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
