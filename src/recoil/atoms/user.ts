import { atom } from 'recoil';
import { recoilKeys } from '@/recoil/data/recoilKeys';
import { User } from '@firebase/auth';

export const userAtom = atom<User | null>({
  key: recoilKeys.userAtom,
  dangerouslyAllowMutability: true,
  default: null,
});
