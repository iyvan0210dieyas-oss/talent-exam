// Firebase configuration and initialization
// To set up: Go to https://console.firebase.google.com
// 1. Create a new project (or use existing)
// 2. Add a Web app to the project
// 3. Copy the firebaseConfig values below
// 4. Go to Firestore Database > Create database > Start in test mode
// 5. Replace the placeholder values below with your actual Firebase config

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCL4l5jk-gg45SwP9FGnjvB-WYOu6zCfls",
  authDomain: "studio-1314166496-9a5e1.firebaseapp.com",
  projectId: "studio-1314166496-9a5e1",
  storageBucket: "studio-1314166496-9a5e1.firebasestorage.app",
  messagingSenderId: "700326801195",
  appId: "1:700326801195:web:446e11021cd840ab539f6e",
};

// Initialize Firebase (prevent re-initialization in Next.js hot-reload)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export { db };
