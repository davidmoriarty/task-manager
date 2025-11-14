// client/src/components/Header.tsx
import { useNavigate } from "react-router";

type HeaderProps = {
   token: string | null;
   onLogout: () => void;
};

export default function Header({ token, onLogout }: HeaderProps) {
   const navigate = useNavigate();

   return (
      <header className="w-full h-[8vh] bg-slate-200 text-slate-900 dark:bg-slate-900 dark:text-slate-50 mb-20">
         <div className="w-full h-full max-w-7xl mx-auto px-4 lg:px-8 flex flex-row items-center justify-between">
            {/* Brand */}
            <div
               className="text-lg font-black cursor-pointer"
               onClick={() => navigate("/")}
            >
               Task Manager
            </div>

            {/* Nav links */}
            <nav className="flex items-center justify-center gap-x-6 lg:gap-x-16 font-medium text-lg">
               <a href="/" className=" hover:text-sky-600 transition-colors">
                  Home
               </a>
               <a
                  href="/about"
                  className="hover:text-sky-600 transition-colors"
               >
                  About
               </a>
               {token ? (
                  <button
                     onClick={onLogout}
                     className="bg-red-600 hover:bg-red-500 text-white px-4 py-1 rounded"
                  >
                     Logout
                  </button>
               ) : (
                  <button
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
