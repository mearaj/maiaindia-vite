import { atom, AtomEffect } from 'recoil';
import { recoilKeys } from '@/recoil/data/recoilKeys';
import { appFirebaseAuth, appFirestore } from '@/firebase';
import {
  collection,
  FieldValue,
  onSnapshot,
  or,
  orderBy,
  query,
  Timestamp,
  where,
} from '@firebase/firestore';
import { onAuthStateChanged } from '@firebase/auth';
import { adminUsers, UserProfile } from '@/config';

export interface SupportChatNoID {
  createdAt: FieldValue;
  createdBy: string;
  createdFor: string;
  updatedAt: FieldValue;
  queryLimit?: number; // to be used only by frontend
}

export interface SupportChat extends SupportChatNoID {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

const querySupportChatsSideEffects: AtomEffect<SupportChat[]> = ({
  setSelf,
  getPromise,
  node,
}) => {
  let supportChatsSubscription = () => {};
  const authSubscription = onAuthStateChanged(appFirebaseAuth, async (user) => {
    if (user === null) {
      setSelf([]);
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
        const supportChats: SupportChat[] = [...(await getPromise(node))];
        // snapshot.docs.forEach((supportChat) => {
        //   if (supportChat.exists()) {
        //     supportChats.push({
        //       ...(supportChat.data() as SupportChat),
        //       id: supportChat.id,
        //     });
        //   }
        // });
        snapshot.docChanges().forEach((change) => {
          const { id } = change.doc;
          if (change.type === 'added') {
            const supportChat: SupportChat = {
              ...(change.doc.data() as SupportChat),
              id,
            };
            supportChats.push(supportChat);
          } else if (change.type === 'modified') {
            const foundIndex = supportChats.findIndex(
              (supportChat) => supportChat.id === id
            );
            if (foundIndex >= 0) {
              supportChats[foundIndex] = {
                ...change.doc.data(),
                id,
              } as SupportChat;
            }
          } else if (change.type === 'removed') {
            const foundIndex = supportChats.findIndex(
              (supportChat) => supportChat.id === id
            );
            if (foundIndex >= 0) {
              supportChats.splice(foundIndex, 1);
            }
          }
        });
        setSelf(supportChats);
      }
    );
  });
  return () => {
    supportChatsSubscription();
    authSubscription();
  };
};

export const supportChatsAtom = atom<SupportChat[]>({
  key: recoilKeys.supportChatsAtom,
  default: [],
  effects: [querySupportChatsSideEffects],
});

export const supportChatUsersAtom = atom<UserProfile[]>({
  key: recoilKeys.supportChatUsersAtom,
  default: adminUsers,
});
export const selectedSupportChatUserAtom = atom<UserProfile | null>({
  key: recoilKeys.selectedSupportChatUserAtom,
  default: null,
});

export const selectedSupportChat = atom<SupportChat | null>({
  key: recoilKeys.selectedSupportChat,
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
  from: string;
  to: string;
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
