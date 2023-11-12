import { signOut as signOutFirebase } from '@firebase/auth';
import { appFirebaseAuth } from '@/firebase/index';

export const signOut = async (): Promise<{ error: string | null }> => {
  try {
    await signOutFirebase(appFirebaseAuth);
    return { error: null };
  } catch (e: unknown) {
    if (e instanceof Error) {
      return { error: e.message };
    }
    return { error: 'An unknown error' };
  }
};
