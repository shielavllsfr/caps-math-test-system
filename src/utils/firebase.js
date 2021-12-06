// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat';
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCTWFFHQ11qqjFSsGUSf2RTe68LgVs4ZsU",
  authDomain: "capstone-math-test-system.firebaseapp.com",
  projectId: "capstone-math-test-system",
  storageBucket: "capstone-math-test-system.appspot.com",
  messagingSenderId: "1059985814882",
  appId: "1:1059985814882:web:44c0b8119b3a5a3709283b",
  measurementId: "G-X220S6Z3F8"
};

// Initialize Firebase
getAnalytics(firebase.initializeApp(firebaseConfig));


export default firebase;