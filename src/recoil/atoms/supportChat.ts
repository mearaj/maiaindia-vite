import { atom, AtomEffect } from 'recoil';
import { recoilKeys } from '@/recoil/data/recoilKeys';
import { appFirebaseAuth, appFirestore } from '@/firebase';
import {
  collection,
  FieldValue,
  limit,
  onSnapshot,
  or,
  orderBy,
  query,
  Timestamp,
  where,
} from '@firebase/firestore';
import { onAuthStateChanged } from '@firebase/auth';
import { SupportChat, SupportChatSession } from '@/recoil/data/supportChat';

import { UserProfile } from '@/recoil/data/user';
import { updateDocsSnapshots } from '@/misc';

const querySupportChatsSideEffects: AtomEffect<SupportChat[]> = ({
  setSelf,
  getPromise,
  node,
}) => {
  let supportChatsSubscription = () => {};
  return onAuthStateChanged(appFirebaseAuth, async (user) => {
    if (user === null) {
      setSelf([]);
      supportChatsSubscription();
      return;
    }
    const collectionReference = collection(appFirestore, 'supportChats');
    const supportChatsQuery = query(
      collectionReference,
      or(
        where(`createdBy`, '==', user.uid),
        where('createdFor', '==', user.uid)
      ),
      orderBy('updatedAt', 'desc')
    );
    supportChatsSubscription = onSnapshot(
      supportChatsQuery,
      async (snapshot) => {
        if (snapshot.metadata.hasPendingWrites) {
          return;
        }
        const snapDocs = updateDocsSnapshots(snapshot, [
          ...(await getPromise(node)),
        ]) as SupportChat[];
        setSelf(snapDocs);
      }
    );
  });
};

export const supportChatsAtom = atom<SupportChat[]>({
  key: recoilKeys.supportChatsAtom,
  default: [],
  effects: [querySupportChatsSideEffects],
});

export const supportChatUsersAtom = atom<UserProfile[]>({
  key: recoilKeys.supportChatUsersAtom,
  default: [],
});
export const selectedSupportChatUserAtom = atom<UserProfile | null>({
  key: recoilKeys.selectedSupportChatUserAtom,
  default: null,
});

export const selectedSupportChatAtom = atom<SupportChat | null>({
  key: recoilKeys.selectedSupportChatAtom,
  default: null,
});

export interface MessageAttachmentNoID {
  url: string;
  mimeType: string;
}

export interface MessageAttachment extends MessageAttachmentNoID {
  id: string;
}

export interface SupportChatMessageNoID {
  from: string | null;
  to: string | null;
  text: string;
  attachments: MessageAttachment[] | MessageAttachmentNoID | null;
  createdAt: FieldValue | Timestamp;
  updatedAt: FieldValue | Timestamp;
}

export interface SupportChatMessage extends SupportChatMessageNoID {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface SupportChatMessages {
  [supportChatID: string]: SupportChatMessage[];
}

export const supportChatsMessagesAtom = atom<SupportChatMessages>({
  dangerouslyAllowMutability: false,
  key: recoilKeys.supportChatsMessagesAtom,
  default: {},
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
