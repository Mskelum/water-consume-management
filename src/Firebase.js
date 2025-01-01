// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDcTOUY1TtZQMKC3c6v50LN6UxD7kVUBas",
    authDomain: "water-consumer-8fc2b.firebaseapp.com",
    projectId: "water-consumer-8fc2b",
    storageBucket: "water-consumer-8fc2b.firebasestorage.app",
    messagingSenderId: "909980564828",
    appId: "1:909980564828:web:46ea435142c237c9529599",
    measurementId: "G-GDTBT500HZ"
  };

// Initialize Firebase
let app;

if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig)
} else {
    app = firebase.app();
}

const auth = firebase.auth();
const db = firebase.firestore();

export { auth };
export { db };