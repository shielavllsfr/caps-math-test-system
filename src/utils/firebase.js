// Import the functions you need from the SDKs you need
import firebase from "firebase/compat";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDvlNZ-wLU3zRJ334v19Io0n86xaDY9jGM",
  authDomain: "capstone-system-aaa2b.firebaseapp.com",
  projectId: "capstone-system-aaa2b",
  storageBucket: "capstone-system-aaa2b.appspot.com",
  messagingSenderId: "398693770773",
  appId: "1:398693770773:web:8ec81c085fdae4d70b101c",
  measurementId: "G-2Q3MZZZ1QD"
};
// Initialize Firebase
getAnalytics(firebase.initializeApp(firebaseConfig));

export default firebase;
