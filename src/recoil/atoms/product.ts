import { atom } from 'recoil';
import { recoilKeys } from '@/recoil/data/recoilKeys';

export const activeProductIdAtom = atom<string>({
  key: recoilKeys.activeProductIdAtom,
  default: '',
});
