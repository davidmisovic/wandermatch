import React from "react";

export default function AppleSignInButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#000",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        width: "280px",
        height: "50px",
        padding: "0 24px",
        fontSize: "1rem",
        fontWeight: 500,
        boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
        cursor: "pointer",
        transition: "box-shadow 0.2s",
      }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="white"
        xmlns="http://www.w3.org/2000/svg"
        style={{ marginRight: 12 }}
      >
        <path d="M16.68 1.8c0 1.14-.93 2.61-2.07 2.61-.12 0-.24-.03-.36-.06.03-.21.06-.42.06-.66 0-1.11.96-2.55 2.13-2.55.09 0 .18.03.24.03zm-2.7 3.93c1.14 0 2.07-.93 2.07-2.61 0-.09-.03-.18-.03-.24-1.17.03-2.49.81-2.49 2.22 0 .12.03.24.06.36.12.03.24.06.39.06zm5.13 4.29c-1.17-1.41-2.82-1.41-3.36-1.41-.6 0-1.23.18-1.98.18-.78 0-1.44-.18-2.01-.18-1.44 0-2.97.81-3.81 2.19-1.32 2.13-.33 5.28.96 7.02.66.93 1.44 1.98 2.49 1.95.99-.03 1.38-.63 2.58-.63 1.2 0 1.53.63 2.58.6 1.05-.03 1.74-.96 2.37-1.89.66-.99.93-1.95.96-2.01-.03-.03-1.86-.72-1.89-2.85-.03-1.8 1.47-2.64 1.53-2.67zm-2.19-3.12c.39-.48.66-1.14.57-1.8-.54.03-1.2.36-1.59.84-.36.42-.69 1.11-.57 1.77.6.06 1.2-.33 1.59-.81z"/>
      </svg>
      Sign in with Apple
    </button>
  );
}