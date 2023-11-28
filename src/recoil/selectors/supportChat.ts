import { selectorFamily } from 'recoil';
import { recoilKeys } from '@/recoil/data/recoilKeys';
import { SupportChat, supportChatsAtom } from '@/recoil/atoms/supportChat';

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
