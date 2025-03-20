"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import styles from "./login.module.css";
import { useRouter } from "next/navigation";
import { useAuth } from "../Components/AuthContext";
import API_ENDPOINTS from "@/app/config/apiconfig";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");  // ✅ Added this
  const { setUser } = useAuth();
  const formRef = useRef(null);
  const API_URL = API_ENDPOINTS.LOGIN_API;
  const router = useRouter();

  // Hide message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(""); // Hide the message after 2 seconds
      }, 2000);

      return () => clearTimeout(timer); // Cleanup function
    }
  }, [message]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (email && password && password.length >= 6) {
        formRef.current.requestSubmit();
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage(""); // Reset message on new submit

    // Email pattern validation
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!email || !password) {
      setError("Email and Password are required!");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email: email, Password: password }),
      });

      const data = await response.json();
      console.log(data);


      if (data.statusCode === 200 && data.message?.token) {
        const token = data.message.token;
        const userdata = data.message.user;
        localStorage.setItem("userData", JSON.stringify(userdata));
        localStorage.setItem("token", token);
        console.log("Token from Login: ", token);

        setMessage("Login successful! Redirecting..."); // Set success message

        setTimeout(() => {
          router.push("/dashboard"); // Redirect after showing message
        }, 1500);
      } else {
        setError("Invalid email or password");
      }
    } catch (error) {
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

        {error && <p className={styles.error}>{error}</p>}

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

          {/* {message && <p className={styles.success}>{message}</p>} */}

          <button
            type="submit"
            className={`${styles.button} ${!(email && password && password.length >= 6) ? styles.disabledButton : ""}`}
            disabled={!(email && password && password.length >= 6)}
          >
            Login
          </button>
        </form>

        <p className={styles.footerText}>
          Forgot Your Password?{" "}
          <Link href="/ResetPasswordEmail" className={styles.link}>Forgot Password</Link>
        </p>
      </div>
    </div>
  );
}
