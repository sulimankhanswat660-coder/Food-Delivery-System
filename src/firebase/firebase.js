import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCqi4sdpPuTAIvrt3xW4-aP2WvSHFu7l4M",
  authDomain: "food-delivery-system-efb62.firebaseapp.com",
  projectId: "food-delivery-system-efb62",
  storageBucket: "food-delivery-system-efb62.firebasestorage.app",
  messagingSenderId: "976952249713",
  appId: "1:976952249713:web:777e1a9fee9fa040583ad0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db  = getFirestore(app);
