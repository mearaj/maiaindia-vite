import { atom } from 'recoil';
import { recoilKeys } from '@/recoil/data/recoilKeys';
import { AppUser } from '@/firebase/user';
import { ChatUser } from '@/config';

export const userAtom = atom<AppUser | null>({
  key: recoilKeys.userAtom,
  dangerouslyAllowMutability: true,
  default: null,
});

export const selectedChatUserAtom = atom<ChatUser | null>({
  key: recoilKeys.selectedChatUser,
  default: null,
});
