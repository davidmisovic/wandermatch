import { useState } from 'react';
import Image from "next/image";
import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect } from 'react';

const provider = new GoogleAuthProvider();

export default function Home() {
 import { useState } from 'react';
import Image from "next/image";
import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect } from 'react';

const provider = new GoogleAuthProvider();

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (user && !authLoading) {
      router.push('/feed');
    }
  }, [user, authLoading, router]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user profile exists, if not create one
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          bio: '',
          interests: [],
          travelStyle: '',
          dreamDestinations: [],
          age: null,
          location: '',
          createdAt: serverTimestamp(),
          lastActive: serverTimestamp(),
        });
      }

      router.push('/feed');
    } catch (error) {
      console.error("Google login failed", error);
      alert("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    try {
      let result;
      if (isSignUp) {
        result = await createUserWithEmailAndPassword(auth, email, password);
        // Create user profile for new email users
        await setDoc(doc(db, "users", result.user.uid), {
          name: email.split('@')[0], // Use email prefix as default name
          email: result.user.email,
          photoURL: null,
          bio: '',
          interests: [],
          travelStyle: '',
          dreamDestinations: [],
          age: null,
          location: '',
          createdAt: serverTimestamp(),
          lastActive: serverTimestamp(),
        });
      } else {
        result = await signInWithEmailAndPassword(auth, email, password);
      }
      
      router.push('/feed');
    } catch (error: any) {
      console.error("Email auth failed", error);
      alert(error.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="max-w-[420px] w-full">
        {/* Header */}
        <h1 className="text-3xl font-bold text-center text-[#1F1F1F] leading-tight mb-2">
          Find your perfect <br /> travel match
        </h1>
        <p className="text-center text-[#555] mb-6">
          Connect with like-minded travelers <br /> and explore the world together.
        </p>

        {/* Illustration */}
        <div className="flex justify-center mb-6">
          <div className="w-[300px] h-[200px] bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
            <div className="text-6xl">✈️🌍</div>
          </div>
        </div>

        {/* Google Button */}
        <div className="flex justify-center mb-3">
          <button 
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex items-center justify-center gap-3 px-6 h-[50px] w-[280px] rounded-xl shadow-md bg-gradient-to-r from-[#7B61FF] to-[#5D9FFF] text-white font-semibold text-[17px] hover:shadow-lg transition-shadow disabled:opacity-50"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="white" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="white" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="white" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="white" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </button>
        </div>

        {/* Apple Button */}
        <div className="flex justify-center mb-6">
          <button 
            disabled={true}
            className="flex items-center justify-center gap-3 px-6 h-[50px] w-[280px] rounded-xl border border-gray-300 text-gray-400 font-semibold text-[17px] bg-white cursor-not-allowed"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            Sign in with Apple (Coming Soon)
          </button>
        </div>

        {/* OR separator */}
        <div className="flex items-center justify-center mb-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-400 font-medium">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Email Form */}
        <form onSubmit={handleEmailAuth} className="flex flex-col gap-3 mb-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-[48px] px-4 rounded-md border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-[48px] px-4 rounded-md border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          
          {/* Sign in/up Button */}
          <div className="flex justify-center mt-2">
            <button 
              type="submit"
              disabled={loading}
              className="w-[280px] h-[50px] rounded-xl bg-gradient-to-r from-[#7B61FF] to-[#5D9FFF] text-white font-semibold text-[17px] shadow-md hover:shadow-lg transition-shadow disabled:opacity-50"
            >
              {loading ? (isSignUp ? 'Creating Account...' : 'Signing In...') : (isSignUp ? 'Create Account' : 'Sign In')}
            </button>
          </div>
        </form>

        {/* Toggle Sign Up/In */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </main>
  );
} 