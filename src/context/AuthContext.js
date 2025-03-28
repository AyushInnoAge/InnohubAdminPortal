"use client";
import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router= useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      localStorage.removeItem("user");
      router.push("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expiry = payload.exp * 1000;

      if (Date.now() > expiry) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
        return;
      }

      // Decode token after validation (optional)
      // setDecoded(jwtDecode(token));
    } catch {
      console.log("Invalid Token");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/login");
    }
  }, [router]); 

  // Load user from localStorage when the app starts
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Function to log in
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // Save in localStorage
  };

  // Function to log out
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user"); // Remove from localStorage
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
