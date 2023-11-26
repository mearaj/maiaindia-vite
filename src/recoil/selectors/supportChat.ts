import { selectorFamily } from 'recoil';
import { recoilKeys } from '@/recoil/data/recoilKeys';
import { SupportChat, supportChatsAtom } from '@/recoil/atoms/supportChat';

// export const supportChatSessionsSelector = selector<SupportChatSessions>({
//   dangerouslyAllowMutability: false,
//   key: recoilKeys.supportChatSessionsSelector,
//   get: async ({ get }) => {
//     const supportChats = get(supportChatsAtom);
//     const supportChatSessions: SupportChatSessions = get(
//       supportChatSessionsAtom
//     );
//     const allSessionIDs = Object.keys(supportChats)
//       .concat(Object.keys(supportChatSessions))
//       .filter((eachSessionID, index, sessionIDsArr) => {
//         return index === sessionIDsArr.indexOf(eachSessionID);
//       });
//     let selectedSupportChatQueries: SupportChatSessions = {};
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
        if (supportChat.members[userUID]) {
          filteredSupportChats = [...filteredSupportChats, supportChat];
        }
      });
      return filteredSupportChats;
    },
});
