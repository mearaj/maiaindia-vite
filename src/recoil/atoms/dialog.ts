import { ReactNode } from 'react';
import { atom } from 'recoil';
import { recoilKeys } from '@/recoil/data/recoilKeys';

export const selectedDialogAtom = atom<ReactNode>({
  key: recoilKeys.selectedDialogAtom,
  default: null,
  dangerouslyAllowMutability: true,
});
