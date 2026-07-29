import { useQueryClient } from "@tanstack/react-query";
import { lazy, Suspense, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import Footer from "./components/Footer";
import Header from "./components/Header";

const Home = lazy(() => import("./components/Home"));
import Login from "./components/Login";

function App() {
  const queryClient = useQueryClient();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [username, setUsername] = useState(
    localStorage.getItem("username") ?? "",
  );
  const [isDemoUser, setIsDemoUser] = useState(
    localStorage.getItem("isDemoUser") === "true",
  );

  function handleLogin() {
    setToken(localStorage.getItem("token"));
    setUsername(localStorage.getItem("username") ?? "");
    setIsDemoUser(localStorage.getItem("isDemoUser") === "true");
  }

  // logout helper (optional)
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("isDemoUser");
    queryClient.clear();

    setToken(null);
    setUsername("");
    setIsDemoUser(false);
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        {/* Header outside of Routes so it's always visible */}
        <Header
          token={token}
          username={username}
          isDemoUser={isDemoUser}
          onLogout={handleLogout}
        />

        {/* Main content area */}
        <main className="flex-1">
          <Suspense
            fallback={
              <p className="p-4 text-center text-muted-foreground">
                Loading...
              </p>
            }
          >
            <Routes>
              {/* Redirect root to login or home depending on auth */}
              <Route
                path="/"
                element={
                  token ? (
                    <Home isDemoUser={isDemoUser} />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/login"
                element={<Login onLogin={handleLogin} />}
              />
            </Routes>
          </Suspense>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
