import { useState } from "react";
import { auth } from "../services/fireBaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import "../styles/auth.css";

export default function AuthenticatePage({ onClose, onSuccess }) {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  function clearMessages() {
    setError("");
    setInfo("");
  }

  function authenticateUser() {
    clearMessages();
    if (isSignIn) {
      loginUser();
    } else {
      signUp();
    }
  }

  const loginUser = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      console.log("user verified!, ", userCredential?.user?.email);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Login failed:", err.message);
      setError("Invalid email or password. Please try again.");
    }
  };

  const signUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      console.log("user verified!, ", userCredential?.user?.email);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("signup failed:", err.message);
      setError("Couldn't create account. " + (err.message || "Try again."));
    }
  };

  const forgetPassword = async () => {
    clearMessages();
    try {
      if (!email || email.trim() === "") {
        setError("Enter your email address first.");
        return;
      }
      await sendPasswordResetEmail(auth, email);
      setInfo("Password reset email sent — check your inbox.");
    } catch (err) {
      setError("Couldn't send reset email. Try again.");
      console.log("Error while forget password:", err);
    }
  };

  function switchTab(toSignIn) {
    clearMessages();
    setIsSignIn(toSignIn);
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <button
          className="auth-close-btn"
          onClick={onClose}
          aria-label="Close"
          id="auth-close-btn"
        >
          ✕
        </button>

        <div className="auth-logo">
          <div className="auth-logo-icon">🔖</div>
          <h1>Smart Bookmark</h1>
        </div>

        <div className="auth-tabs" role="tablist">
          <button
            className={`auth-tab-btn ${isSignIn ? "active" : ""}`}
            onClick={() => switchTab(true)}
            role="tab"
            aria-selected={isSignIn}
            id="tab-signin"
          >
            Sign in
          </button>
          <button
            className={`auth-tab-btn ${!isSignIn ? "active" : ""}`}
            onClick={() => switchTab(false)}
            role="tab"
            aria-selected={!isSignIn}
            id="tab-signup"
          >
            Sign up
          </button>
        </div>

        <div className="auth-form">
          <div className="auth-field">
            <label className="auth-label" htmlFor="auth-email">Email</label>
            <input
              id="auth-email"
              className="auth-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              className="auth-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") authenticateUser();
              }}
              autoComplete={isSignIn ? "current-password" : "new-password"}
            />
          </div>

          {error && (
            <div className="auth-alert error" role="alert">
              {error}
            </div>
          )}
          {info && (
            <div className="auth-alert info" role="status">
              {info}
            </div>
          )}

          <button
            className="auth-submit-btn"
            onClick={authenticateUser}
            id="auth-submit-btn"
          >
            {isSignIn ? "Sign in" : "Create account"}
          </button>
        </div>

        <div className="auth-footer">
          <div className="auth-divider" />
          {isSignIn ? (
            <p
              className="auth-link"
              onClick={() => switchTab(false)}
              id="auth-switch-to-signup"
            >
              No account yet? <span>Sign up for free</span>
            </p>
          ) : (
            <p
              className="auth-link"
              onClick={() => switchTab(true)}
              id="auth-switch-to-signin"
            >
              Already have an account? <span>Sign in</span>
            </p>
          )}
          <p
            className="auth-link"
            onClick={forgetPassword}
            id="auth-forgot-password"
          >
            Forgot password
          </p>
        </div>
      </div>
    </div>
  );
}
