import {
  createContext,
  PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { onAuthStateChanged } from '@firebase/auth';
import { appFirebaseAuth } from '@/firebase';
import { useRecoilState } from 'recoil';
import { userAtom } from '@/recoil/atoms';

export interface AuthState {
  isLoadingAuth: boolean;
}

const initialState: AuthState = {
  isLoadingAuth: true,
};

export const FirebaseContext = createContext<AuthState>(initialState);

export default function FirebaseProvider({ children }: PropsWithChildren) {
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [user, setUser] = useRecoilState(userAtom);

  useEffect(() => {
    return onAuthStateChanged(appFirebaseAuth, (userAlt) => {
      setIsLoadingAuth(false);
      setUser(userAlt);
    });
  }, [setUser, user]);

  const authState = useMemo(
    () => ({
      isLoadingAuth,
    }),
    [isLoadingAuth]
  );

  return (
    <FirebaseContext.Provider value={authState}>
      {children}
    </FirebaseContext.Provider>
  );
}
