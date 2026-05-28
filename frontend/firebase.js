// Firebase Compatible Configuration for VMart
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
firebase.initializeApp(firebaseConfig);

// Initialize Google Auth Provider
const provider = new firebase.auth.GoogleAuthProvider();

// Initialize Auth
const auth = firebase.auth();
