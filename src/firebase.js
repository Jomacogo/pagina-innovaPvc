import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCSSkqJickqM6lCATQ3FJSE2kfkKw-CVjE",
  authDomain: "catalogo-innovapvc.firebaseapp.com",
  projectId: "catalogo-innovapvc",
  storageBucket: "catalogo-innovapvc.firebasestorage.app",
  messagingSenderId: "793959801094",
  appId: "1:793959801094:web:9fb405699ea74b4984be87",
  measurementId: "G-VDVT3QL72Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
