import { selector, selectorFamily } from 'recoil';
import { recoilKeys } from '@/recoil/data/recoilKeys';
import {
  SupportChats,
  supportChatsAtom,
  SupportChatsQueries,
  supportChatsQueriesAtom,
  SupportChatUsers,
} from '@/recoil/atoms/supportChat';
import { doc, getDoc } from '@firebase/firestore';
import { appFirestore } from '@/firebase';
import { adminUsers, UserProfile } from '@/config';

export const supportChatsQueriesSelector = selector<SupportChatsQueries>({
  dangerouslyAllowMutability: false,
  key: recoilKeys.supportChatsQueriesSelector,
  get: ({ get }) => {
    const supportChats = get(supportChatsAtom);
    const supportChatsQueries: SupportChatsQueries = get(
      supportChatsQueriesAtom
    );
    const allSessionIDs = Object.keys(supportChats)
      .concat(Object.keys(supportChatsQueries))
      .filter((eachSessionID, index, sessionIDsArr) => {
        return index === sessionIDsArr.indexOf(eachSessionID);
      });
    let selectedSupportChatQueries: SupportChatsQueries = {};
    allSessionIDs.forEach((supportChatID) => {
      if (supportChats[supportChatID] && !supportChatsQueries[supportChatID]) {
        selectedSupportChatQueries = {
          ...selectedSupportChatQueries,
          [supportChatID]: {
            limit: 10,
          },
        };
      } else if (
        supportChats[supportChatID] &&
        supportChatsQueries[supportChatID]
      ) {
        selectedSupportChatQueries = {
          ...selectedSupportChatQueries,
          [supportChatID]: supportChatsQueries[supportChatID],
        };
      }
    });
    return selectedSupportChatQueries;
  },
});

const defaultChatUsers = adminUsers.reduce((prev, curr) => {
  return {
    ...prev,
    [curr.uid]: curr,
  };
}, {}) as SupportChatUsers;

export const supportChatUsersSelector = selector<SupportChatUsers>({
  key: recoilKeys.supportChatUsersSelector,
  get: async ({ get }) => {
    const supportChats = get(supportChatsAtom);
    let chatUsers = { ...defaultChatUsers };
    for await (const eachSupportChatID of Object.keys(supportChats)) {
      for await (const eachMemberID of Object.keys(
        supportChats[eachSupportChatID].members
      )) {
        const foundUser = chatUsers[eachMemberID];
        if (!foundUser) {
          const userDocQuery = doc(appFirestore, 'users', eachMemberID);
          const userDocRef = await getDoc(userDocQuery);
          let userProfile: UserProfile = { uid: eachMemberID };
          if (userDocRef.exists()) {
            userProfile = {
              ...userProfile,
              ...(userDocRef.data()?.profile ?? {}),
            };
            chatUsers = {
              ...chatUsers,
              [userProfile.uid]: userProfile,
            };
          }
        }
      }
    }
    return chatUsers;
  },
});

export const supportChatsFilteredByUserID = selectorFamily<
  SupportChats,
  string
>({
  key: recoilKeys.supportChatsFilteredByUserID,
  get:
    (userUID) =>
    ({ get }) => {
      const supportChats = get(supportChatsAtom);
      let filteredSupportChats: SupportChats = {};
      Object.keys(supportChats).forEach((supportChatID) => {
        if (supportChats[supportChatID].members[userUID]) {
          filteredSupportChats = {
            ...filteredSupportChats,
            [supportChatID]: supportChats[supportChatID],
          };
        }
      });
      return filteredSupportChats;
    },
});

// for await (const eachMember of Object.keys(chatSession.members)) {
//   let foundUser: UserProfile | null = null;
//   if (currentChatSessions[eachMember]) {
//     foundUser = currentChatSessions[eachMember].user;
//   }
//   if (foundUser) {
//     const sessions =
//       { ...currentChatSessions[foundUser.uid].sessions } ?? {};
//     currentChatSessions = {
//       ...currentChatSessions,
//       [foundUser.uid]: {
//         user: foundUser,
//         sessions: {
//           ...sessions,
//           [chatSession.id]: {
//             id: chatSession.id,
//             createdAt: chatSession.createdAt,
//             updatedAt: chatSession.updatedAt,
//             members: chatSession.members,
//           },
//         },
//       },
//     };
//   } else {
//     const userDocQuery = doc(appFirestore, 'users', eachMember);
//     const userDocRef = await getDoc(userDocQuery);
//     let userProfile: UserProfile = { uid: eachMember };
//     if (userDocRef.exists()) {
//       userProfile = {
//         ...userProfile,
//         ...(userDocRef.data()?.profile ?? {}),
//       };
//       const sessions =
//         { ...currentChatSessions[userProfile.uid].sessions } ?? {};
//       currentChatSessions = {
//         ...currentChatSessions,
//         [userProfile.uid]: {
//           user,
//           sessions: {
//             ...sessions,
//             [chatSession.id]: {
//               id: chatSession.id,
//               createdAt: chatSession.createdAt,
//               updatedAt: chatSession.updatedAt,
//               members: chatSession.members,
//             },
//           },
//         },
//       };
//     }
//   }
// }
