import { atom } from 'recoil';
import { recoilKeys } from '@/recoil/data/recoilKeys';

export const menuAtom = atom<boolean>({
  key: recoilKeys.menuAtom,
  default: false,
});
