import { atom } from 'recoil';
import { recoilKeys } from '@/recoil/data/recoilKeys';
import { User } from '@firebase/auth';
import { UserProfile } from '@/config';

export interface AppUser {
  user: User;
  profile: UserProfile;
}

export const userAtom = atom<AppUser | null>({
  key: recoilKeys.userAtom,
  dangerouslyAllowMutability: true,
  default: null,
});
