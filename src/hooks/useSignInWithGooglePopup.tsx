import { appFirebaseAuth } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup } from '@firebase/auth';
import { useCallback, useState } from 'react';
import { useRecoilState } from 'recoil';
import { AuthState, authStateAtom } from '@/recoil/atoms/authState';

export default function useSignInWithGooglePopup() {
  const [error, setError] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useRecoilState(authStateAtom);

  const clearError = useCallback(() => {
    if (error) {
      setError(null);
    }
  }, [error]);

  const signInWithGooglePopUp = useCallback(async (): Promise<void> => {
    if (isAuthLoading === AuthState.idle) {
      setIsAuthLoading(AuthState.signingIn);
      clearError();
      try {
        const provider = new GoogleAuthProvider();
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
  }, [clearError, isAuthLoading, setIsAuthLoading]);
  return {
    isAuthLoading,
    error,
    clearError,
    signInWithGooglePopUp,
  };
}
