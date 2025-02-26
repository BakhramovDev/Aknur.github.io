import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; // ✅ Firebase Storage qo‘shildi

const firebaseConfig = {
  apiKey: "AIzaSyD7tFyRPBSlBIUFszn-V3rqCS-RQE4L9Y0",
  authDomain: "aknur-messenger-895fe.firebaseapp.com",
  databaseURL: "https://aknur-messenger-895fe-default-rtdb.firebaseio.com",
  projectId: "aknur-messenger-895fe",
  storageBucket: "aknur-messenger-895fe.appspot.com",

  messagingSenderId: "870773064716",
  appId: "1:870773064716:web:a885ede222b98c3f4f1a29",
  measurementId: "G-5T5SY1BGL3"
};


// Firebase ilovasini faqat bir marta ishga tushirish
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getDatabase(app);
export const auth = getAuth(app);
export const storage = getStorage(app); // ✅ Firebase Storage eksport qilindi
