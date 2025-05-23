// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB632Wz-WRaIi-n1r3Z6GEptKv7mnGGPIk",
  authDomain: "todoloo-e7b97.firebaseapp.com",
  projectId: "todoloo-e7b97",
  storageBucket: "todoloo-e7b97.firebasestorage.app",
  messagingSenderId: "1042947829183",
  appId: "1:1042947829183:web:379d1bda57b08bd450050a",
  measurementId: "G-RCZYJ97SL1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
export { app, db };