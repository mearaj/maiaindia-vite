import { selectorFamily } from 'recoil';
import { recoilKeys } from '@/recoil/data/recoilKeys';
import { SupportChat, supportChatsAtom } from '@/recoil/atoms/supportChat';

// export const supportChatMessagesSelector = selector<SupportChatMessages>({
//   dangerouslyAllowMutability: false,
//   key: recoilKeys.supportChatMessagesSelector,
//   get: async ({ get }) => {
//     const supportChats = get(supportChatsAtom);
//     const supportChatSessions: SupportChatMessages = get(
//       supportChatsMessagesAtom
//     );
//     const allSessionIDs = Object.keys(supportChats)
//       .concat(Object.keys(supportChatSessions))
//       .filter((eachSessionID, index, sessionIDsArr) => {
//         return index === sessionIDsArr.indexOf(eachSessionID);
//       });
//     let selectedSupportChatQueries: SupportChatMessages = {};
//     allSessionIDs.forEach((supportChatID) => {
//       if (supportChats[supportChatID] && !supportChatSessions[supportChatID]) {
//         selectedSupportChatQueries = {
//           ...selectedSupportChatQueries,
//           [supportChatID]: {
//             chat: supportChats[supportChatID],
//           },
//         };
//       } else if (
//         supportChats[supportChatID] &&
//         supportChatSessions[supportChatID]
//       ) {
//         selectedSupportChatQueries = {
//           ...selectedSupportChatQueries,
//           [supportChatID]: supportChatSessions[supportChatID],
//         };
//       }
//     });
//     return selectedSupportChatQueries;
//   },
// });

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
