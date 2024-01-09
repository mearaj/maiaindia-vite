import { atom } from 'recoil';
import { recoilKeys } from '@/recoil/data/recoilKeys';
import { appFirebaseAuth, appFirestore } from '@/firebase';
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from '@firebase/firestore';
import { onAuthStateChanged } from '@firebase/auth';
import { SupportChatSession } from '@/recoil/data/supportChat';

import { UserProfile } from '@/recoil/data/user';

export const supportChatUsersAtom = atom<UserProfile[]>({
  key: recoilKeys.supportChatUsersAtom,
  default: [],
});
export const selectedSupportChatUserAtom = atom<UserProfile | null>({
  key: recoilKeys.selectedSupportChatUserAtom,
  default: null,
});

export const currentUserLiveChatMaximizedAtom = atom<boolean>({
  key: recoilKeys.currentUserLiveChatMaximizedAtom,
  default: false,
});

export const currentUserLastActiveChatSessionAtom =
  atom<SupportChatSession | null>({
    key: recoilKeys.currentUserLastActiveChatSessionAtom,
    default: null,
    effects: [
      ({ setSelf }) => {
        let lastActiveChatSubscription = () => {};
        return onAuthStateChanged(appFirebaseAuth, async (user) => {
          if (!user) {
            setSelf(null);
            lastActiveChatSubscription();
            return;
          }
          const supportChatsQuery = query(
            collection(appFirestore, 'supportChats'),
            orderBy('updatedAt', 'desc'),
            limit(1),
            where('customerID', '==', user.uid),
            where('status', '==', 'open')
          );
          lastActiveChatSubscription = onSnapshot(
            supportChatsQuery,
            async (supportChatsSnapshot) => {
              if (supportChatsSnapshot.metadata.hasPendingWrites) {
                return;
              }
              if (supportChatsSnapshot.empty) {
                setSelf(null);
                return;
              }
              const currentLastChatSession = {
                ...(supportChatsSnapshot.docs[0].data() as SupportChatSession),
                id: supportChatsSnapshot.docs[0].id,
              };
              setSelf(currentLastChatSession);
            }
          );
        });
      },
    ],
  });
