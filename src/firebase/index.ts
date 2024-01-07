// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from '@firebase/auth';
import { getFirestore } from '@firebase/firestore';
import { getStorage } from '@firebase/storage';
import { getAnalytics, logEvent } from '@firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  // authDomain: 'maiaindia.firebaseapp.com',
  authDomain: 'maiaindia.com',
  projectId: 'maiaindia',
  storageBucket: 'maiaindia.appspot.com',
  messagingSenderId: '1088462500931',
  appId: '1:1088462500931:web:d0dd90bc67ec3a27ab10f6',
  databaseURL:
    'https://maiaindia-default-rtdb.asia-southeast1.firebasedatabase.app',
  measurementId: 'G-1Z4HVC0Q9E',
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
// const analytics = getAnalytics(firebaseApp);
const appFirestore = getFirestore(appFirebase);
const appFirebaseAuth = getAuth(appFirebase);
const appFirebaseStorage = getStorage(appFirebase);

const appFirebaseRealtime = getDatabase(appFirebase);

const appAnalytics = getAnalytics(appFirebase);

logEvent(appAnalytics, 'notification_received');

// setLogLevel('debug');

export default appFirebase;

export {
  appFirestore,
  appFirebaseAuth,
  appFirebaseStorage,
  appFirebaseRealtime,
  appAnalytics,
};
