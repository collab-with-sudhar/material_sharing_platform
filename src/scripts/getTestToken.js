// scripts/getTestToken.js
const { initializeApp } = require("firebase/app");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");
require('dotenv').config();

// 1. Get these from your Firebase Console > Project Settings > General > "Your apps"
// You might need to create a "Web App" in Firebase console to get these config values
const firebaseConfig = {
  apiKey: "AIzaSyBFbFkAja2tqwrNwJk4_EIhaUCXm0_Twz4",
  authDomain: "studyapp-83137.firebaseapp.com",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 2. Use a real user you created in Firebase Console (Authentication > Users > Add User)
const email = "sarathaswin1234@gmail.com"; 
const password = "sarath@2005";

const getToken = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
    console.log("\n===========================================");
    console.log("YOUR TEST TOKEN (Copy this for Postman):");
    console.log("===========================================\n");
    console.log(token);
    console.log("\n===========================================");
    process.exit(0);
  } catch (error) {
    console.error("Error signing in:", error.message);
    process.exit(1);
  }
};

getToken();