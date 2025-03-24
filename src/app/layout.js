'use client'
import { usePathname } from "next/navigation";
import { AuthProvider } from "../context/AuthContext";
import "./globals.css";
import Navbar from "./navbar/page";
import { useState, useEffect } from "react";

export default function RootLayout({ children }) {
  const [token, setToken] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, [pathname]);

  return (
    <html lang="en">
      <body className="bg-gray-100">
        <AuthProvider>
          {token ? <Navbar /> : null}
          <div className="pt-16">
            {/* Adjust padding to avoid overlap */}
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
