import { GoogleAuthProvider, signInWithPopup, User } from '@firebase/auth';
import { appFirebaseAuth } from '@/firebase/index';

export const signInWithGooglePopUp = async (): Promise<{
  data: User | null;
  error: string | null;
}> => {
  try {
    const provider = new GoogleAuthProvider();
    const { user } = await signInWithPopup(appFirebaseAuth, provider);
    return { data: user, error: '' };
  } catch (e) {
    if (e instanceof Error) {
      return { data: null, error: e.message };
    }
    return { data: null, error: 'An unknown error' };
  }
};
