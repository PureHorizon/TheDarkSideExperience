// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCxudE-0h2wvVHARfXU8FrGwhK2BDakFgk",
  authDomain: "thedarksideexperience-58792.firebaseapp.com",
  projectId: "thedarksideexperience-58792",
  storageBucket: "thedarksideexperience-58792.appspot.com",
  messagingSenderId: "927396544039",
  appId: "1:927396544039:web:5e8b56621447a8c5055802"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);