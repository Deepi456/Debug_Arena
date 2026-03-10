// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCioXUF3Xx9WHp4oSfvserD62VOmaO5zpQ",
    authDomain: "debugarena-621b3.firebaseapp.com",
    projectId: "debugarena-621b3",
    storageBucket: "debugarena-621b3.firebasestorage.app",
    messagingSenderId: "551124179291",
    appId: "1:551124179291:web:7d86909bc309993406e27e",
    measurementId: "G-6CBWHDWGT4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };