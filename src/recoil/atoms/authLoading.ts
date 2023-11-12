import { atom } from 'recoil';
import { recoilKeys } from '@/recoil/data/recoilKeys';

export const authLoadingAtom = atom<boolean>({
  key: recoilKeys.authLoadingAtom,
  default: true,
});
