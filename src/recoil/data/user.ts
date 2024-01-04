import { User } from '@firebase/auth';
import { AuthState } from '@/recoil/atoms/user';

export interface UserProfile {
  email?: string | null;
  uid?: string; // only required for frontend
  displayName?: string | null;
  photoURL?: string | null;
}

export interface AppUser {
  authState: AuthState;
  userState: {
    user: User;
    profile: UserProfile;
  } | null;
}
