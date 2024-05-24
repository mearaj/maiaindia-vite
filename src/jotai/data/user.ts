import { User } from '@firebase/auth';

import { AuthState } from '@/jotai/data/auth';
import { Cart } from '@/jotai/data/cart';
import { FieldValue, Timestamp } from '@firebase/firestore';

export { default as userPlaceholderSvgUrl } from '@/images/user-placeholder.svg';
export { default as userPlaceholderPngUrl } from '@/images/user-placeholder.png';

export interface UserProfile {
  email: string | null;
  id?: string; // only required for frontend
  displayName: string | null;
  photoURL?: string | null; // only required for frontend
}

export interface BackendUser {
  id?: string;
  profile: UserProfile;
  cart: Cart;
  updatedAt: FieldValue | Timestamp;
}

export interface UserState extends BackendUser {
  user: User;
}

export interface UserStateWithAuth {
  authState: AuthState;
  userState: UserState | null;
}
