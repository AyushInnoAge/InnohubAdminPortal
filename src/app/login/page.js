"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import styles from "./login.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const formRef = useRef(null);
  const API_URL = "http://localhost:5279/login";

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      formRef.current.requestSubmit();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      alert("Email and Password are required!");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email: email, Password: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Invalid email or password");
        setError(data.message || "Invalid email or password");
        return;
      }

      alert("Login Successful!");
    } catch (error) {
      alert("Network error. Please try again.");
      setError("Network error. Please try again.");
      console.error("Login failed:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <img src="/logo.svg" alt="Innoage Logo" className={styles.logo} />
        <h2 className={styles.title}>Welcome To Inno Age</h2>
        <p className={styles.subtitle}>Sign in to your account</p>

        <form ref={formRef} onSubmit={handleSubmit} className={styles.form}>
          <input
            type="email"
            placeholder="Email"
            name="email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            required
          />

          <div className={styles.passwordContainer}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              name="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              required
            />
            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button type="submit" className={styles.button}>Login</button>
        </form>

        <p className={styles.footerText}>
          Forgot Your Password?{" "}
          <Link href="/ResetPassword" className={styles.link}>Forgot Password</Link>
        </p>
      </div>
    </div>
  );
}
