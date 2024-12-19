// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import { getAuth } from "firebase/auth";
import "firebase/compat/firestore";
import "firebase/compat/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAAENlox1hYwPKkVaGMopptzhVlq2VXknI",
  authDomain: "clone-3f208.firebaseapp.com",
  projectId: "clone-3f208",
  storageBucket: "clone-3f208.firebasestorage.app",
  messagingSenderId: "1017409689335",
  appId: "1:1017409689335:web:c11e20e51c7e8d42e625f2",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = app.firestore();
