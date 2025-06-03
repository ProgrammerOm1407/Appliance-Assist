
// src/lib/firebaseConfig.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// IMPORTANT: Replace with your Firebase project's configuration
// You can find this in your Firebase project settings
const firebaseConfig = {

  apiKey: "AIzaSyAYuWTQ_QTr_wyFfdT2Wm4lTc4mLW-C9bQ",
  authDomain: "appliance-assist-2kpf9.firebaseapp.com",
  projectId: "appliance-assist-2kpf9",
  storageBucket: "appliance-assist-2kpf9.firebasestorage.app",
  messagingSenderId: "579988150133",
  appId: "1:579988150133:web:86678f4c4a934f2e67653c"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const db = getFirestore(app);

export { app, db };
