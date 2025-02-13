import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB8D-g4AZsPRXEDAmYICZYmXz_aJVuaCb4",
  authDomain: "cosmos-5627d.firebaseapp.com",
  projectId: "cosmos-5627d",
  storageBucket: "cosmos-5627d.firebasestorage.app",
  messagingSenderId: "228946323285",
  appId: "1:228946323285:web:93dc963928a02c807a71dc",
  measurementId: "G-Q4DLZ6LY8X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

// Enable offline persistence
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled in one tab at a time
      console.log('Persistence failed: Multiple tabs open');
    } else if (err.code === 'unimplemented') {
      // The current browser doesn't support persistence
      console.log('Persistence not supported by browser');
    }
  });

export { app, analytics, db, auth };
