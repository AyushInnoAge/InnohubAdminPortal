'use client'
import { usePathname } from "next/navigation";
import { AuthProvider } from "../context/AuthContext";
import "./globals.css";
import Navbar from "./navbar/page";
import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function RootLayout({ children }) {
  const [token, setToken] = useState(null);
  const pathname = usePathname();
  var queryClient = new QueryClient();
  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, [pathname]);

  return (
    <html lang="en">
      <body className=  {token?"bg-gray-100 pt-16" :"bg-gray-100"}>
        <AuthProvider>
         <QueryClientProvider client={queryClient}>
          {token ? <Navbar /> : null}
            {/* Adjust padding to avoid overlap */}
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
           
            </QueryClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
