// lib/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC2lkRdrSdoTJHcJYX0xDtJhbbxWkQbIA4",
  authDomain: "wandermatch-dev.firebaseapp.com",
  projectId: "wandermatch-dev",
  storageBucket: "wandermatch-dev.firebasestorage.app",
  messagingSenderId: "164068407764",
  appId: "1:164068407764:web:848d239293077c0301be41",
  measurementId: "G-3ESE2VG43R"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
