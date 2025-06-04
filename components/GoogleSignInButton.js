import React from "react";

export default function GoogleSignInButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        background: "#fff",
        color: "#222",
        border: "none",
        borderRadius: "8px",
        padding: "12px 24px",
        fontSize: "1rem",
        fontWeight: 500,
        boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
        cursor: "pointer",
        transition: "box-shadow 0.2s",
      }}
    >
      <img
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
        alt="Google logo"
        style={{ width: 24, height: 24, marginRight: 12 }}
      />
      Sign in with Google
    </button>
  );
}