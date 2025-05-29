import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

const provider = new GoogleAuthProvider();

export default function LoginButton() {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // 👇 Uloženie do Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
      });

      alert(`Welcome, ${user.displayName}!`);
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
