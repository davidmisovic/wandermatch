import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../lib/firebase";

const provider = new GoogleAuthProvider();

export default function LoginButton() {
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      alert("Logged in!");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <button onClick={handleLogin}>
      Sign in with Google
    </button>
  );
}
