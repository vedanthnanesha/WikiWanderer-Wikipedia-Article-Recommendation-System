// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCvMZTD3YLcSJUIwtzEAyAVLPW_1JDVLaM",
  authDomain: "wikipediae-eb661.firebaseapp.com",
  projectId: "wikipediae-eb661",
  storageBucket: "wikipediae-eb661.appspot.com",
  messagingSenderId: "352731811912",
  appId: "1:352731811912:web:f7de899c49901cd926c87d",
  measurementId: "G-S5KTBQG80P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // Initialize Firebase Auth

export { app, analytics, auth }; 

