// Import the functions you need from the SDKs you need
import firebase from "firebase/compat";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBCmMftlTm0N1kLtkQTaCGTHE0nxPHqImM",
  authDomain: "test-test-test-test-39afe.firebaseapp.com",
  projectId: "test-test-test-test-39afe",
  storageBucket: "test-test-test-test-39afe.appspot.com",
  messagingSenderId: "233876505908",
  appId: "1:233876505908:web:8b858775384d1c65df9161",
  measurementId: "G-BPZVNRDFLX",
};
// Initialize Firebase
getAnalytics(firebase.initializeApp(firebaseConfig));

export default firebase;
