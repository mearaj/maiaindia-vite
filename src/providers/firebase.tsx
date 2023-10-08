import { createContext, PropsWithChildren, useEffect, useState } from 'react';
import {
  FacebookAuthProvider,
  getRedirectResult,
  GoogleAuthProvider,
  linkWithRedirect,
  onAuthStateChanged,
  ProviderId,
  signInWithRedirect,
  signOut as signOutFirebase,
  User,
} from '@firebase/auth';
import { FirebaseError } from '@firebase/util';
import { auth } from '@/config/firebase';

export interface AuthState {
  isLoading: boolean;
  user: User | null;
  signIn: (providerID: string) => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const initialState: AuthState = {
  isLoading: true,
  user: null,
  signIn: async (_) => {},
  signOut: async () => {},
  error: null,
  clearError: () => {},
};

export const FirebaseContext = createContext<AuthState>(initialState);
const errAccExistsKey = 'auth/account-exists-with-different-credential';
const redirectKey = '@firebase/auth.getRedirectResult';

export default function FirebaseProvider({ children }: PropsWithChildren) {
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingRedirectResult, setIsLoadingRedirectResult] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const signOut = async () => {
    setIsSigningOut(true);
    try {
      await signOutFirebase(auth);
      setUser(null);
    } catch (e: unknown) {
      if (e instanceof FirebaseError) {
        setError(e.code);
      } else if (e?.toString()) {
        setError(e.toString());
      }
    }
    setIsSigningOut(false);
  };

  const signIn = async (providerID: string) => {
    let provider;
    switch (providerID) {
      case ProviderId.GOOGLE:
        provider = new GoogleAuthProvider();
        break;
      case ProviderId.FACEBOOK:
        provider = new FacebookAuthProvider();
        break;
      default:
        break;
    }
    if (provider) {
      setIsSigningIn(true);
      localStorage.setItem(redirectKey, providerID);
      try {
        await signInWithRedirect(auth, provider);
      } catch (e: unknown) {
        if (e instanceof FirebaseError) {
          setError(e.code);
        } else if (e?.toString()) {
          setError(e.toString());
        }
      }
      setIsSigningIn(false);
    }
  };

  useEffect(() => {
    const providerID = localStorage.getItem(redirectKey);
    if (providerID) {
      const onGetRedirectResult = async () => {
        const providerIDAlt = localStorage.getItem(redirectKey);
        localStorage.removeItem(redirectKey);
        let errStr: string | null = null;
        if (providerIDAlt) {
          setIsLoadingRedirectResult(true);
          try {
            const result = await getRedirectResult(auth);
            if (result) {
              // check if link with redirect required
              const errVal = localStorage.getItem(errAccExistsKey);
              localStorage.removeItem(errAccExistsKey);
              if (errVal) {
                const firebaseError: FirebaseError = JSON.parse(errVal);
                const verifiedProvider = (
                  firebaseError.customData?._tokenResponse as any
                ).verifiedProvider[0];
                const { providerId } = firebaseError.customData
                  ?._tokenResponse as any;
                if (
                  verifiedProvider === ProviderId.GOOGLE &&
                  providerId === ProviderId.FACEBOOK
                ) {
                  const provider = new FacebookAuthProvider();
                  await linkWithRedirect(result.user, provider);
                }
              }
            }
          } catch (err: unknown) {
            if (err instanceof FirebaseError) {
              if (err.code === errAccExistsKey) {
                const verifiedProvider = (err.customData?._tokenResponse as any)
                  .verifiedProvider[0];
                const { providerId } = err.customData?._tokenResponse as any;
                if (
                  verifiedProvider === ProviderId.GOOGLE &&
                  providerId === ProviderId.FACEBOOK
                ) {
                  localStorage.setItem(errAccExistsKey, JSON.stringify(err));
                  signIn(verifiedProvider);
                }
              } else {
                errStr = err.code;
              }
            } else {
              errStr = (err as any).toString();
            }
          }
          setError(errStr);
          setIsLoadingRedirectResult(false);
        }
      };
      onGetRedirectResult();
    }
  }, []);

  useEffect(() => {
    return onAuthStateChanged(auth, (userAlt) => {
      setIsLoadingAuth(false);
      setUser(userAlt);
    });
  }, []);

  const clearError = () => {
    setError(null);
  };

  return (
    <FirebaseContext.Provider
      value={{
        isLoading:
          isLoadingAuth ||
          isLoadingRedirectResult ||
          isSigningIn ||
          isSigningOut,
        signIn,
        signOut,
        user,
        error,
        clearError,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
}
