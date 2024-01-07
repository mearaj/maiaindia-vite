// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from '@firebase/auth';
import { DocumentData, getFirestore, QuerySnapshot } from '@firebase/firestore';
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
export const appFirebase = initializeApp(firebaseConfig);
// const analytics = getAnalytics(firebaseApp);
export const appFirestore = getFirestore(appFirebase);
export const appFirebaseAuth = getAuth(appFirebase);
export const appFirebaseStorage = getStorage(appFirebase);

export const appFirebaseRealtime = getDatabase(appFirebase);

export const appAnalytics = getAnalytics(appFirebase);

logEvent(appAnalytics, 'notification_received');

// setLogLevel('debug');

export const updateDocsSnapshots = (
  snapshot: QuerySnapshot,
  snapDocs: DocumentData[]
) => {
  snapshot.docChanges().forEach((change) => {
    const { id } = change.doc;
    const foundIndex = snapDocs.findIndex((docItem) => docItem.id === id);
    const docItem = {
      ...change.doc.data(),
      id,
    };
    switch (change.type) {
      case 'added':
      case 'modified':
        if (foundIndex >= 0) {
          snapDocs[foundIndex] = docItem;
        } else {
          snapDocs.unshift(docItem);
        }
        break;
      case 'removed':
        if (foundIndex >= 0) {
          snapDocs.splice(foundIndex, 1);
        }
        break;
      default:
        break;
    }
  });
  return snapDocs;
};

export default appFirebase;
