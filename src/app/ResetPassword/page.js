"use client";
import { useState } from "react";
import Link from "next/link";
import styles from "./resetpassword.module.css";
import { Eye, EyeOff } from "lucide-react"; // Import eye icons

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = ""; // Change this to your actual API endpoint

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset errors

    if (!password || !confirmPassword) {
      alert("All fields are required!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST", // Use POST or PUT depending on your API
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      alert("Password reset successful! You can now log in.");
    } catch (error) {
      setError(error.message);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <img src="/logo.svg" alt="Innoage Logo" className={styles.logo} />
        <p className={styles.subtitle}>Reset Your Password</p>

        {/* {error && <p className={styles.error}>{error}</p>} Show errors if any */}

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* <input
            type="email"
            placeholder="Email"
            className={styles.input}
            value={email}
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          /> */}
          <input
            type="text"
            placeholder="Enter Your New Password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className={styles.passwordContainer}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              autoComplete="new-password"
              name="ConfirmPassword"
              className={styles.input}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => setShowConfirmPassword((prev) => !prev)} // Use prev state for better toggling
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>


          <button
            type="submit"
            className={`${styles.button} ${!password || !confirmPassword ? styles.disabledButton : ""}`}
            disabled={!password || !confirmPassword || loading}
          >
            {loading ? "Resetting..." : "Reset"}
          </button>
        </form>

        <p className={styles.footerText}>
          Already have an account?{" "}
          <Link href="/login" className={styles.link}>Login</Link>
        </p>
      </div>
    </div>
  );
}
