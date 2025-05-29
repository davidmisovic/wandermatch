"use client";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../lib/firebase";

export default function LoginButton() {
  const login = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <button
      onClick={login}
      style={{
        padding: "1rem 2rem",
        fontSize: "1.2rem",
        backgroundColor: "#0070f3",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
      }}
    >
      Sign in with Google
    </button>
  );
}
