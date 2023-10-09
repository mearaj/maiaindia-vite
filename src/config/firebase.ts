// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from '@firebase/auth';
import { getFirestore } from '@firebase/firestore';
import { getStorage } from '@firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBdG_eyuxuA9EHs8DCYKR2B51AtBOhNKv0',
  authDomain: 'maiaindia.firebaseapp.com',
  projectId: 'maiaindia',
  storageBucket: 'maiaindia.appspot.com',
  messagingSenderId: '1088462500931',
  appId: '1:1088462500931:web:d0dd90bc67ec3a27ab10f6',
  measurementId: 'G-1Z4HVC0Q9E',
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
// const analytics = getAnalytics(firebaseApp);
export const firestore = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);
export const storage = getStorage(firebaseApp);

export default firebaseApp;
