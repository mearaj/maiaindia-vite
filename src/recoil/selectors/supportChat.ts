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

// export const supportChatUsersSelector = selector<SupportChatUsers>({
//   key: recoilKeys.supportChatUsersSelector,
//   get: async ({ get }) => {
//     const supportChats = get(supportChatsAtom);
//     return supportChats;
//     let chatUsers = { ...defaultChatUsers };
//     for await (const eachSupportChatID of Object.keys(supportChats)) {
//       for await (const eachMemberID of Object.keys(
//         supportChats[eachSupportChatID].members
//       )) {
//         const foundUser = chatUsers[eachMemberID];
//         if (!foundUser) {
//           const userDocQuery = doc(appFirestore, 'users', eachMemberID);
//           const userDocRef = await getDoc(userDocQuery);
//           let userProfile: UserProfile = { uid: eachMemberID };
//           if (userDocRef.exists()) {
//             userProfile = {
//               ...userProfile,
//               ...(userDocRef.data()?.profile ?? {}),
//             };
//             chatUsers = {
//               ...chatUsers,
//               [userProfile.uid]: userProfile,
//             };
//           }
//         }
//       }
//     }
//     return chatUsers;
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
