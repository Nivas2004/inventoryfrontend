import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCAqLJALK2S9t3snGHRHRn6-ED_btmHf14",
  authDomain: "inventory-88558.firebaseapp.com",
  projectId: "inventory-88558",
  storageBucket: "inventory-88558.firebasestorage.app",
  messagingSenderId: "641405424048",
  appId: "1:641405424048:web:b8fcc8cdab628e84f90675",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
