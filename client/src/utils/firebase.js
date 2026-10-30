import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDilKWyKioouAup4azjQrVw15HJWFxF158",
  authDomain: "interview-ai-ff89b.firebaseapp.com",
  projectId: "interview-ai-ff89b",
  storageBucket: "interview-ai-ff89b.firebasestorage.app",
  messagingSenderId: "299758387647",
  appId: "1:299758387647:web:2309c845cbd39a07b5210a",
  measurementId: "G-52TEB06SGT"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
