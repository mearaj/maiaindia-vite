import { ReactNode } from 'react';
import { atom } from 'jotai';

export const selectedDialogAtom = atom<ReactNode>(null);
