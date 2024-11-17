// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  // onAuthStateChanged,
  updateProfile,
  deleteUser,
  reauthenticateWithCredential, EmailAuthProvider
  // updatePassword,

} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDoc,
  getDocs,
  serverTimestamp,
  onSnapshot,
  deleteDoc, doc, updateDoc,query, where
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBa9QrRWNVq7oGXD2ECdzMtyBYCQEtCujo",
  authDomain: "fir-task1-39596.firebaseapp.com",
  projectId: "fir-task1-39596",
  storageBucket: "fir-task1-39596.appspot.com",
  messagingSenderId: "422669912553",
  appId: "1:422669912553:web:69fbeb5247a42c80446378",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Export Firebase functionality
export {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  // onAuthStateChanged,
  updateProfile,
  // updatePassword,
  GoogleAuthProvider,
  signInWithPopup,
  collection,
  addDoc,
  doc,
  getDocs,
  getDoc,
  db,
  serverTimestamp,
  onSnapshot,
  deleteDoc, updateDoc,deleteUser,reauthenticateWithCredential, EmailAuthProvider,query, where
};
