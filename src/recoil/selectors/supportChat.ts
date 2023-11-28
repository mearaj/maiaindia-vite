import { selector, selectorFamily } from 'recoil';
import { recoilKeys } from '@/recoil/data/recoilKeys';
import {
  selectedSupportChatAtom,
  selectedSupportChatUserAtom,
  SupportChat,
  supportChatsAtom,
} from '@/recoil/atoms/supportChat';
import { UserProfile } from '@/config';

export const supportChatsFilteredByUserID = selectorFamily<
  SupportChat[],
  string
>({
  key: recoilKeys.supportChatsFilteredByUserID,
  get:
    (userUID) =>
    ({ get }) => {
      const supportChats = get(supportChatsAtom);
      let filteredSupportChats: SupportChat[] = [];
      supportChats.forEach((supportChat) => {
        if (
          supportChat.createdBy === userUID ||
          supportChat.createdFor === userUID
        ) {
          filteredSupportChats = [...filteredSupportChats, supportChat];
        }
      });
      return filteredSupportChats;
    },
});

export const selectedSupportChatUserSelector = selector<UserProfile | null>({
  key: recoilKeys.selectedSupportChatUserSelector,
  get: ({ get }) => {
    return get(selectedSupportChatUserAtom);
  },
  set: ({ set }, newValue) => {
    set(selectedSupportChatAtom, null);
    set(selectedSupportChatUserAtom, newValue);
  },
});
