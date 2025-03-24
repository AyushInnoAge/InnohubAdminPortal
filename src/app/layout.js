import { AuthProvider } from "../context/AuthContext";
import "./globals.css";
import Navbar from "./navbar/page";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <AuthProvider>
          <Navbar />
          <div className="pt-16">
            {/* Adjust padding to avoid overlap */}
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
