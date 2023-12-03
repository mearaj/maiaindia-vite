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
          /*
           * 1. Check if user profile exist at firebase firestore database.
           * 2. If user profile doesn't exist, then create a new profile from social profile
           * 3. During creation of new profile from social profile, we need to download photo from
           *    social profile url and upload it to firebase storage.
           * 4. If user profile exist then we need to make sure that profile fields exists.
           *    If they don't exist, then we need to check if they exist in user social profile.
           *    If they exist, then we need to update firebase firestore user's profile
           * 4. We need to make sure that the photoURL property of user profile at firebase firestore
           *    matches the url of firebase storage. If it doesn't, then we need to update user profile at
           *    firebase firestore database.
           * */
          let userProfile: UserProfile = { uid: user.uid };
          // Check if user's profile exists in firestore database
          const docRef = doc(appFirestore, 'users', user.uid);
          const docSnapshot = await getDoc(docRef);
          const userProfileExist = docSnapshot.exists();
          if (userProfileExist) {
            const snapshotProfile = docSnapshot.data().profile as UserProfile;
            // if profile doesn't exists or profile displayName doesn't exists but social displayName
            // exists or profile photoUrl doesn't exists but social photoURL exists or email doesn't exists
            // but social email exist
            userProfile = {
              ...userProfile,
              ...snapshotProfile,
            };
          } else {
            userProfile = {
              uid: user.uid,
              displayName: user.displayName,
              email: user.email,
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
            console.log(e);
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
            } catch (e) {
              /* empty */
              console.log(e);
            }
          }
          if (!userProfile.displayName) {
            userProfile.displayName = user.displayName;
          }
          if (!userProfile.email) {
            userProfile.email = user.email;
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
    ({ onSet }) => {
      onSet((newAppUser, _oldAppUser) => {
        const { userState } = newAppUser;
        if (userState !== null) {
          const asyncSet = async () => {
            let backendProfile: UserProfile = { uid: userState.profile.uid };
            const { profile: userProfile } = userState;
            const docRef = doc(appFirestore, 'users', userState.profile.uid);
            const docSnapshot = await getDoc(docRef);
            const userProfileExist = docSnapshot.exists();
            if (userProfileExist) {
              const snapshotProfile = docSnapshot.data().profile as UserProfile;
              // if profile doesn't exists or profile displayName doesn't exists but social displayName
              // exists or profile photoUrl doesn't exists but social photoURL exists or email doesn't exists
              // but social email exist
              backendProfile = {
                ...backendProfile,
                ...snapshotProfile,
              };
            }
            const updateRequired =
              userProfile.uid !== backendProfile.uid ||
              userProfile.email !== backendProfile.email ||
              userProfile.displayName !== backendProfile.displayName ||
              userProfile.photoURL !== backendProfile.photoURL;
            if (updateRequired) {
              await setDoc(
                docRef,
                { profile: userProfile },
                { mergeFields: ['profile'] }
              );
            }
          };
          asyncSet();
        }
      });
    },
  ],
});
