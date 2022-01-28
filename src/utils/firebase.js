// Import the functions you need from the SDKs you need
import firebase from "firebase/compat";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC4JfBorzf8svNQUv8f_gjtFQy5R_MaPTI",
  authDomain: "testing001-70868.firebaseapp.com",
  projectId: "testing001-70868",
  storageBucket: "testing001-70868.appspot.com",
  messagingSenderId: "182858975392",
  appId: "1:182858975392:web:b0b9fbc898306859dc21c5",
  measurementId: "G-CZSYTHBVSB",
};
// Initialize Firebase
getAnalytics(firebase.initializeApp(firebaseConfig));

export default firebase;
