import { appFirebaseAuth } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup } from '@firebase/auth';
import { useCallback, useState } from 'react';
import { userAtom } from '@/jotai/atoms';

import { AuthState } from '@/jotai/data/auth';
import { useAtom } from 'jotai';

export default function useSignInWithGooglePopup() {
  const [error, setError] = useState<string | null>(null);
  const [{ authState, userState }, setAppUser] = useAtom(userAtom);

  const clearError = useCallback(() => {
    if (error) {
      setError(null);
    }
  }, [error]);

  const signInWithGooglePopUp = useCallback(async (): Promise<void> => {
    if (authState === AuthState.idle) {
      setAppUser({ authState: AuthState.signingIn, userState });
      clearError();
      try {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({
          prompt: 'select_account',
        });
        await signInWithPopup(appFirebaseAuth, provider);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError('An unknown error');
        }
      } finally {
        /* empty */
      }
    }
  }, [authState, clearError, setAppUser, userState]);
  return {
    error,
    clearError,
    signInWithGooglePopUp,
  };
}
