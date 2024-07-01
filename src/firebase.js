// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics"; //not required right now
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC4uaB5KFIyhcOy4al-fnEAl-lvhUJbbVs",
  authDomain: "podcast-app-react-rec-68f44.firebaseapp.com",
  projectId: "podcast-app-react-rec-68f44",
  storageBucket: "podcast-app-react-rec-68f44.appspot.com",
  messagingSenderId: "192618591316",
  appId: "1:192618591316:web:e017f435b1fbee4f3469c1",
  measurementId: "G-GCJ4MFGTFT",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { auth, db, storage };
