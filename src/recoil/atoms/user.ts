import { atom } from 'recoil';
import { recoilKeys } from '@/recoil/data/recoilKeys';
import { AppUser } from '@/firebase/user';

export const userAtom = atom<AppUser | null>({
  key: recoilKeys.userAtom,
  dangerouslyAllowMutability: true,
  default: null,
});
