import { selector, selectorFamily } from 'recoil';
import { recoilKeys } from '@/recoil/data/recoilKeys';
import {
  selectedSupportChatAtom,
  selectedSupportChatUserAtom,
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
      const supportChatsQuery = query(collection(appFirestore, 'users'));
      const querySnapShot = await getDocs(supportChatsQuery);
      if (querySnapShot.empty) {
        return {};
      }
      for await (const eachDoc of querySnapShot.docs) {
        const supportChatUserSessionsQuery = query(
          collection(appFirestore, 'users', eachDoc.id, 'supportChatSessions')
        );
        const supportChatUserSessionsSnapshot = await getDocs(
          supportChatUserSessionsQuery
        );
        for await (const eachSession of supportChatUserSessionsSnapshot.docs) {
          if (eachSession.exists()) {
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
              ...(eachSession.data() as SupportChatSession),
              id: eachSession.id,
            });
          }
        }
      }
      return supportChatsUserSessionMap;
    },
  });
