// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDU-HwMzyxucdeyTIrA1Ub9eGM3C1fbIQY",
  authDomain: "vmart-4746a.firebaseapp.com",
  projectId: "vmart-4746a",
  storageBucket: "vmart-4746a.firebasestorage.app",
  messagingSenderId: "216270227631",
  appId: "1:216270227631:web:7116407c1cc8ae061dac5a",
  measurementId: "G-HM85QQYCRT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
