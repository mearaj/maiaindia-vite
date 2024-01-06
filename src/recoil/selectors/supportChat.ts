import { selector, selectorFamily } from 'recoil';
import { recoilKeys } from '@/recoil/data/recoilKeys';
import {
  selectedSupportChatAtom,
  selectedSupportChatUserAtom,
  SupportChatMessage,
  supportChatsAtom,
} from '@/recoil/atoms/supportChat';
import {
  SupportChat,
  SupportChatSession,
  SupportChatUsersSessionsMap,
} from '@/recoil/data/supportChat';
import { isAdminSelector } from '@/recoil/selectors/isAdmin';
import { collection, doc, getDoc, getDocs, query } from '@firebase/firestore';
import { appFirestore } from '@/firebase';
import { UserProfile } from '@/recoil/data/user';
import { userAtom } from '@/recoil/atoms';

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

export const supportChatUsersSessionsMapSelector =
  selector<SupportChatUsersSessionsMap>({
    key: recoilKeys.supportChatUsersSessionsMapSelector,
    get: async ({ get }) => {
      const isAdmin = get(isAdminSelector);
      if (!isAdmin) {
        return {};
      }
      const supportChatsUserSessionMap: SupportChatUsersSessionsMap = {};
      const supportChatsQuery = query(collection(appFirestore, 'supportChats'));
      const querySnapShot = await getDocs(supportChatsQuery);
      if (querySnapShot.empty) {
        return {};
      }
      for await (const eachDoc of querySnapShot.docs) {
        if (eachDoc.exists()) {
          if (!supportChatsUserSessionMap[eachDoc.id]) {
            const userProfileDoc = await getDoc(
              doc(appFirestore, 'users', eachDoc.id)
            );
            const profile: UserProfile = {
              ...(userProfileDoc?.data()?.profile ?? {}),
              uid: eachDoc.id,
            };
            supportChatsUserSessionMap[eachDoc.id] = {
              sessions: [],
              profile,
            };
          }
          supportChatsUserSessionMap[eachDoc.id].sessions.push({
            ...(eachDoc.data() as SupportChatSession),
            id: eachDoc.id,
          });
        }
      }
      return supportChatsUserSessionMap;
    },
  });

export const chatSessionMessagesSelectorFamily = selectorFamily<
  SupportChatMessage[],
  string
>({
  key: recoilKeys.chatSessionMessagesSelectorFamily,
  get:
    (chatSessionID) =>
    async ({ get }) => {
      const user = get(userAtom);
      if (!user) {
        return [];
      }
      const messagesCollectionRef = collection(
        appFirestore,
        'supportChats',
        chatSessionID,
        'supportChatMessages'
      );
      const messagesSnapshot = await getDocs(messagesCollectionRef);
      const messages: SupportChatMessage[] = [];
      messagesSnapshot.docs.forEach((eachMessage) => {
        messages.push({
          ...(eachMessage.data() as SupportChatMessage),
          id: eachMessage.id,
        });
      });
      return messages;
    },
});
