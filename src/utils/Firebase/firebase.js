import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  confirmPasswordReset,
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

//Config API
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};
// eslint-disable-next-line
const app = initializeApp(firebaseConfig);
export const storage = getStorage();

const provider = new GoogleAuthProvider();
provider.getCustomParameters({
  prompt: 'Select_account',
});
export const auth = getAuth();

// Sign in method
export const signInWithGoogleAcc = () => signInWithPopup(auth, provider);
export const signInWithEmailAndPass = async (email, password) => {
  if (!email || !password) return;
  return await signInWithEmailAndPassword(auth, email, password);
};

export const db = getFirestore();
//create document users
// 1) create by Google Account
export const createUserDocumentFromAuth = async (
  userAuth,
  additionalInfor = {},
) => {
  const userDocRef = doc(db, 'users', userAuth.uid);
  const userSnapShot = await getDoc(userDocRef);
  if (!userSnapShot.exists()) {
    const { displayName, email, photoURL, uid, phoneNumber } = userAuth;
    const createDateUser = new Date();
    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        photoURL,
        createDateUser,
        uid,
        phoneNumber,
        ...additionalInfor,
      });
    } catch (err) {
      console.log('Error from create users:', err);
    }
  }
  return userDocRef;
};
//2) Create by Email, Password from User data
export const createUserByEmailAndPass = async (email, password) => {
  if (!email || !password) return;
  return await createUserWithEmailAndPassword(auth, email, password);
};

// Reset password
export const resetPassword = async (email) => {
  if (!email) return;
  return await sendPasswordResetEmail(auth, email);
};
export const confirmThePasswordReset = async (oobCode, newPassword) => {
  if (!oobCode && !newPassword) return;
  return await confirmPasswordReset(auth, oobCode, newPassword);
};
