import { User } from '@firebase/auth';

export interface UserProfile {
  displayName: string;
  photoURL: string;
}

export interface AppUser {
  user: User;
  profile: UserProfile;
}
