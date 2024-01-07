import { User } from '@firebase/auth';

import { AuthState } from '@/recoil/data/auth';
import { Cart } from '@/recoil/data/cart';

export interface UserProfile {
  email: string | null;
  uid?: string; // only required for frontend
  displayName: string | null;
  photoURL?: string | null; // only required for frontend
}

export interface AppUser {
  authState: AuthState;
  userState: {
    user: User;
    profile: UserProfile;
    cart: Cart;
  } | null;
}

export const userPlaceholderUrl = `https://firebasestorage.googleapis.com/v0/b/maiaindia.appspot.com/o/images%2Fuser-placeholder.svg?alt=media`;
