import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Home from "./components/Home";
import Login from "./components/Login";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
   const [token, setToken] = useState(localStorage.getItem("token"));

   console.log("App render, token =", token);

   function handleLogin() {
      const storedToken = localStorage.getItem("token");
      console.log("handleLogin called, token =", storedToken);
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
         <main className="w-full flex flex-col items-center justify-start">
            <Routes>
               {/* Redirect root to login or home depending on auth */}
               <Route
                  path="/"
                  element={
                     token ? (
                        <Home onLogout={handleLogout} />
                     ) : (
                        <Navigate to="/login" replace />
                     )
                  }
               />
               <Route path="/login" element={<Login onLogin={handleLogin} />} />
            </Routes>
         </main>

         <Footer />
      </BrowserRouter>
   );
}

export default App;
