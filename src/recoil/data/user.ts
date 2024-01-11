import { User } from '@firebase/auth';

import { AuthState } from '@/recoil/data/auth';
import { Cart } from '@/recoil/data/cart';

export { default as userPlaceholderSvgUrl } from '@/images/user-placeholder.svg';
export { default as userPlaceholderPngUrl } from '@/images/user-placeholder.png';

export interface UserProfile {
  email: string | null;
  id?: string; // only required for frontend
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
