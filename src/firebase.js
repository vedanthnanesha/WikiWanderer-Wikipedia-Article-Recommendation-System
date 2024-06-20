const { initializeApp } = require("firebase/app");

const { getAuth } = require("firebase/auth"); 
const {getFirestore} = require("firebase/firestore")

const firebaseConfig = {
  apiKey: "AIzaSyCvMZTD3YLcSJUIwtzEAyAVLPW_1JDVLaM",
  authDomain: "wikipediae-eb661.firebaseapp.com",
  projectId: "wikipediae-eb661",
  storageBucket: "wikipediae-eb661.appspot.com",
  messagingSenderId: "352731811912",
  appId: "1:352731811912:web:f7de899c49901cd926c87d",
  measurementId: "G-S5KTBQG80P"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app); 
const db = getFirestore(app);

module.exports = { app, auth, db }; 

