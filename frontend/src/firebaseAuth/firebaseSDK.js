// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getFirestore } from 'firebase/firestore'
import { getDatabase } from 'firebase/database'
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD5yMxgik0W468LmPfXX7Ls1lB05nmE2NM",
  authDomain: "leaderboard-6f8af.firebaseapp.com",
  projectId: "leaderboard-6f8af",
  storageBucket: "leaderboard-6f8af.appspot.com",
  messagingSenderId: "564760106155",
  appId: "1:564760106155:web:b090eca862534ca01cd3ee",
  measurementId: "G-SPWHZ232Q5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app)

// const analytics = getAnalytics(app);



