import {
  createContext,
  PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  getRedirectResult,
  GoogleAuthProvider,
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
            await getRedirectResult(auth);
          } catch (err: unknown) {
            if (err instanceof FirebaseError) {
              errStr = err.code;
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

  const authState = useMemo(
    () => ({
      isLoading:
        isLoadingAuth || isLoadingRedirectResult || isSigningIn || isSigningOut,
      signIn,
      signOut,
      user,
      error,
      clearError,
    }),
    [
      error,
      isLoadingAuth,
      isLoadingRedirectResult,
      isSigningIn,
      isSigningOut,
      user,
    ]
  );

  return (
    <FirebaseContext.Provider value={authState}>
      {children}
    </FirebaseContext.Provider>
  );
}
