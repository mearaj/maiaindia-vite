import { atom } from 'recoil';
import { recoilKeys } from '@/recoil/data/recoilKeys';
import { onAuthStateChanged, User } from '@firebase/auth';
import { appFirebaseAuth, appFirebaseStorage, appFirestore } from '@/firebase';
import { FirebaseError } from '@firebase/util';
import { getDownloadURL, ref, uploadBytes } from '@firebase/storage';
import { doc, getDoc, setDoc } from '@firebase/firestore';
import { AppUser, UserProfile } from '@/recoil/data/user';

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

export const userPlaceholderUrl = `https://firebasestorage.googleapis.com/v0/b/maiaindia.appspot.com/o/images%2Fuser-placeholder.svg?alt=media`;
export const userAtom = atom<AppUser>({
  key: recoilKeys.userAtom,
  dangerouslyAllowMutability: true,
  default: { authState: AuthState.loading, userState: null },
  effects: [
    ({ setSelf, getPromise, node }) => {
      return onAuthStateChanged(appFirebaseAuth, async (user: User | null) => {
        if (user) {
          const prevAuthState = await getPromise(node);
          setSelf({ ...prevAuthState, authState: AuthState.loading });
          let userProfile: UserProfile = { uid: user.uid };
          const docRef = doc(appFirestore, 'users', user.uid);
          const docSnapshot = await getDoc(docRef);
          const userProfileExist = docSnapshot.exists();
          if (userProfileExist) {
            const snapshotProfile = docSnapshot.data().profile as UserProfile;
            userProfile = {
              ...userProfile,
              ...snapshotProfile,
            };
          }
          // Check if profile photo exists at storage
          const firebaseImageRef = ref(
            appFirebaseStorage,
            `users/${user.uid}/profile`
          );
          try {
            userProfile.photoURL = await getDownloadURL(firebaseImageRef);
          } catch (e) {
            if (e instanceof FirebaseError) {
              // If photoURL is not found then remove it from profile
              if (e.code === 'object-not-found') {
                userProfile.photoURL = null;
              } else {
                console.log(e);
              }
            } else {
              console.log(e);
            }
          }
          // If profile picture doesn't exist, then fetch image from google profile
          // and upload to firebase storage
          if (!userProfile.photoURL && user.photoURL) {
            try {
              const response = await fetch(user.photoURL);
              const blob = await response.blob();
              const file = new File([blob], 'profile', {
                type: blob.type,
              });
              await uploadBytes(firebaseImageRef, file);
              userProfile.photoURL = await getDownloadURL(firebaseImageRef);
            } catch (e: unknown) {
              /* empty */
              console.log(e);
            }
          }
          let updateProfileRequired = false;
          if (!userProfile.displayName && user.displayName) {
            userProfile.displayName = user.displayName;
            updateProfileRequired = true;
          }
          if (!userProfile.email && user.email) {
            userProfile.email = user.email;
            updateProfileRequired = true;
          }
          if (updateProfileRequired) {
            await setDoc(
              docRef,
              {
                profile: {
                  displayName: userProfile.displayName,
                  email: userProfile.email,
                },
              },
              { mergeFields: ['profile'] }
            );
          }
          setSelf({
            authState: AuthState.idle,
            userState: {
              user,
              profile: userProfile,
            },
          });
        } else {
          setSelf({ authState: AuthState.idle, userState: null });
        }
      });
    },
  ],
});
