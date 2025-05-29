import LoginButton from "../components/LoginButton";

export default function Home() {
  return (
    <main style={{ padding: "2rem", fontSize: "1.5rem" }}>
      <h1>Welcome to Wandermatch MVP 👋</h1>
      <p style={{ marginTop: "0.5rem", fontSize: "1.2rem", color: "#555" }}>
        Match. Travel. Connect. ✈️
      </p>
      <p style={{ marginTop: "1.5rem" }}>
        Connect with like-minded travelers around the world.
      </p>
      <LoginButton />
    </main>
  );
}
