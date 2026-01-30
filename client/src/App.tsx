import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./components/Home";
import Login from "./components/Login";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  function handleLogin() {
    setToken(localStorage.getItem("token"));
  }

  // logout helper (optional)
  function handleLogout() {
    localStorage.removeItem("token");
    setToken(null);
  }

  return (
    <BrowserRouter>
      {/* Header outside of Routes so it's always visible */}
      <Header token={token} onLogout={handleLogout} />

      {/* Main content area */}
      <main className="flex flex-col flex-1">
        <Routes>
          {/* Redirect root to login or home depending on auth */}
          <Route
            path="/"
            element={token ? <Home /> : <Navigate to="/login" replace />}
          />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
