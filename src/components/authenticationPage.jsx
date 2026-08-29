import { useState } from "react";
import { auth } from "../services/fireBaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

export default function AuthenticatePage({ onClose, onSuccess }) {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [authenticated, setAuthenticated] = useState(false);

  function authenticateUser() {
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
      setAuthenticated(true);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Login failed:", error.message);
      setError("Invalid credentials");
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
      setAuthenticated(true);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("signup failed:", error.message);
      setError("Something went wrong, try again ");
    }
  };

  const forgetPassword = async () => {
    try {
      if (!email || email === " ") {
        setError("Please put the email before");
        return;
      }

      await sendPasswordResetEmail(auth, email);
      setError("Password reset email sent");
    } catch (err) {
      setError("Something went wrong, try again");
      console.log("Error while forget passwrod :", err);
    }
  };

  return (
    <>
      <div>
        <button onClick={onClose}> Close</button>
        <div>
          {isSignIn ? <p>Sign in</p> : <p>Sign up</p>}

          <div>
            <label htmlFor="email"> Email </label>
            <input
              type="email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
            />

            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") authenticateUser();
              }}
            />

            <button onClick={authenticateUser}>Submit</button>
          </div>
          {error && <p>{error}</p>}
          <div>
            {isSignIn ? (
              <p onClick={() => setIsSignIn(false)}>
                {" "}
                Don't have an account? Sign up
              </p>
            ) : (
              <p onClick={() => setIsSignIn(true)}>
                Already have an account? Sign in
              </p>
            )}

            <p onClick={forgetPassword}>Forget password</p>
          </div>
        </div>
      </div>
    </>
  );
}
