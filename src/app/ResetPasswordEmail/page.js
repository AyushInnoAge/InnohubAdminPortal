"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import styles from "./resetpasswordemail.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
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
    setMessage("");
    setLoading(true);

    // Validate email format
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5279/api/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Email not found in our records.");
      }

      // If email exists, send the reset link
      const resetResponse = await fetch("http://localhost:5279/api/send-reset-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const resetData = await resetResponse.json();

      if (!resetResponse.ok) {
        throw new Error(resetData.message || "Failed to send reset link.");
      }

      setMessage("A reset link has been sent to your email.");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <img src="/logo.svg" alt="Innoage Logo" className={styles.logo} />
        <h2 className={styles.title}>Welcome To Inno Age</h2>
        <p className={styles.subtitle}>Trouble logging in?</p>

        <form ref={formRef} onSubmit={handleSubmit} className={styles.form}>
          <input
            type="email"
            placeholder="Enter Email"
            name="email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            required
          />



          <button
            type="submit"
            className={`${styles.button} ${!email ? styles.disabledButton : ""}`}
            disabled={!email}
          >
            Send Login Link
          </button>
        </form>

        <p className={styles.footerText}>
          Back to Login : {" "}
          <Link href="/login" className={styles.link}>Login</Link>
        </p>
      </div>
    </div>
  );
}
