// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore"; // Import Firestore functionality

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "",
  authDomain: "webcam-8fdab.firebaseapp.com",
  projectId: "webcam-8fdab",
  storageBucket: "webcam-8fdab.appspot.com",
  messagingSenderId: "106459464265",
  appId: "1:106459464265:web:654bfab2033e13c4c8b598",
  measurementId: "G-Y7WYEPBPB6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); // Add Firestore functionality
export const storage = getStorage(app);
