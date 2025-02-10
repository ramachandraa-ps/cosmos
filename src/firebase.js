import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

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

export { app, analytics };
