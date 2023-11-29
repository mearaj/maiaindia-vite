import { atom } from 'recoil';
import { recoilKeys } from '@/recoil/data/recoilKeys';
import { onAuthStateChanged, User } from '@firebase/auth';
import { appFirebaseAuth, appFirebaseStorage, appFirestore } from '@/firebase';
import { getDownloadURL, ref, uploadBytes } from '@firebase/storage';
import { doc, getDoc, setDoc } from '@firebase/firestore';
import { UserProfile } from '@/config';

export enum AuthState {
  idle,
  loading,
  signingIn,
  signingOut,
  updatingProfile,
}

export const authStateEnumToString = (
  authStateEnum: AuthState
): string | null => {
  let text: string | null = null;
  switch (authStateEnum) {
    case AuthState.loading:
      text = 'Loading...';
      break;
    case AuthState.signingIn:
      text = 'Signing In...';
      break;
    case AuthState.signingOut:
      text = 'Signing Out...';
      break;
    case AuthState.updatingProfile:
      text = 'Updating Profile...';
      break;
    default:
      text = null;
  }
  return text;
};

export interface AppUser {
  authState: AuthState;
  userState: {
    user: User;
    profile: UserProfile;
  } | null;
}

export const userPlaceholderUrl = `https://firebasestorage.googleapis.com/v0/b/maiaindia.appspot.com/o/images%2Fuser-placeholder.svg?alt=media`;
export const userAtom = atom<AppUser>({
  key: recoilKeys.userAtom,
  dangerouslyAllowMutability: true,
  default: { authState: AuthState.loading, userState: null },
  effects: [
    ({ setSelf }) => {
      return onAuthStateChanged(appFirebaseAuth, async (user: User | null) => {
        if (user) {
          let profile: UserProfile = { uid: user.uid };
          // Check if user's profile exists in firestore database
          const docRef = doc(appFirestore, 'users', user.uid);
          const docSnapshot = await getDoc(docRef);
          const userDocExists = docSnapshot.exists();
          if (userDocExists) {
            profile = {
              ...profile,
              ...docSnapshot.data()?.profile,
            };
          }
          // If profile picture doesn't exist, then fetch image from google profile
          // and upload to firebase storage
          if (!profile.photoURL && user.photoURL) {
            try {
              const response = await fetch(user.photoURL);
              const blob = await response.blob();
              const file = new File([blob], 'profile', {
                type: blob.type,
              });
              const firebaseImageRef = ref(
                appFirebaseStorage,
                `users/${user.uid}/profile`
              );
              await uploadBytes(firebaseImageRef, file);
              profile.photoURL = await getDownloadURL(firebaseImageRef);
            } catch (e) {
              /* empty */
              console.log(e);
            }
          }
          if (!profile.displayName && user.displayName) {
            profile.displayName = user.displayName;
          }
          await setDoc(docRef, { profile }, { mergeFields: ['profile'] });
          // Note: We don't save google photo url in firebase database but we download
          // photo and upload it to firebase storage and then save the photoURL in database
          if (!profile.photoURL && user.photoURL) {
            profile.photoURL = user.photoURL;
          }

          setSelf({
            authState: AuthState.idle,
            userState: {
              user,
              profile,
            },
          });
        } else {
          setSelf({ authState: AuthState.idle, userState: null });
        }
      });
    },
  ],
});
