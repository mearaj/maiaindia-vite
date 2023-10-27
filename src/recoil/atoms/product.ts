import { atom } from 'recoil';
import { recoilKeys } from '@/recoil/data/recoilKeys';

export const productIdAtom = atom<string>({
  key: recoilKeys.productIdAtom,
  default: '',
});
