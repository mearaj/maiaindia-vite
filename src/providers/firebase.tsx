import {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  ProviderId,
  signInWithPopup,
  signOut as signOutFirebase,
  User,
} from '@firebase/auth';
import { FirebaseError } from '@firebase/util';
import { appFirebaseAuth } from '@/firebase';

export interface AuthState {
  isLoading: boolean;
  user: User | null;
  signIn: (providerID: string) => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
  clearError: () => void;
  isAdmin: () => boolean;
}

const initialState: AuthState = {
  isLoading: true,
  user: null,
  signIn: async (_) => {},
  signOut: async () => {},
  error: null,
  clearError: () => {},
  isAdmin: () => false,
};

export const FirebaseContext = createContext<AuthState>(initialState);

export default function FirebaseProvider({ children }: PropsWithChildren) {
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const signOut = async () => {
    setIsSigningOut(true);
    try {
      await signOutFirebase(appFirebaseAuth);
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
      try {
        await signInWithPopup(appFirebaseAuth, provider);
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
    return onAuthStateChanged(appFirebaseAuth, (userAlt) => {
      setIsLoadingAuth(false);
      setUser(userAlt);
    });
  }, []);

  const clearError = () => {
    setError(null);
  };

  const isAdmin = useCallback(() => {
    if (!user) {
      return false;
    }
    const adminUsers = import.meta.env.VITE_ADMIN_EMAIL.split(',');
    for (let i = 0; i < adminUsers.length; i += 1) {
      if (user.email === adminUsers[i]) {
        return true;
      }
    }
    return false;
  }, [user]);

  const authState = useMemo(
    () => ({
      isLoading: isLoadingAuth || isSigningIn || isSigningOut,
      signIn,
      signOut,
      user,
      error,
      clearError,
      isAdmin,
    }),
    [error, isAdmin, isLoadingAuth, isSigningIn, isSigningOut, user]
  );

  return (
    <FirebaseContext.Provider value={authState}>
      {children}
    </FirebaseContext.Provider>
  );
}
