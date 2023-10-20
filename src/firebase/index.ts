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
  // authDomain: 'maiaindia.firebaseapp.com',
  authDomain: 'maiaindia.com',
  projectId: 'maiaindia',
  storageBucket: 'maiaindia.appspot.com',
  messagingSenderId: '1088462500931',
  appId: '1:1088462500931:web:d0dd90bc67ec3a27ab10f6',
  measurementId: 'G-1Z4HVC0Q9E',
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
// const analytics = getAnalytics(firebaseApp);
const appFirestore = getFirestore(appFirebase);
const appFirebaseAuth = getAuth(appFirebase);
const appFirebaseStorage = getStorage(appFirebase);

export default appFirebase;

// Do not uncomment this, only used for uploading docs during development by admin
// const uploadDocs = async () => {
//   for (let i = 0; i < mockProducts.length; i += 1) {
//     setDoc(doc(appFirestore, 'products', mockProducts[i].id), {
//       price: mockProducts[i].price,
//       name: mockProducts[i].name,
//       images: mockProducts[i].images,
//       categoryID: mockProducts[i].categoryID,
//       priceHistory: mockProducts[i].priceHistory,
//     });
//   }
// };
// uploadDocs();

// remove id property from product
// const deleteIDProp = async () => {
//   for (let i = 0; i < mockProducts.length; i += 1) {
//     updateDoc(doc(appFirestore, 'products', mockProducts[i].id), {
//       id: deleteField(),
//     });
//   }
// };
// deleteIDProp();
export { appFirestore, appFirebaseAuth, appFirebaseStorage };
