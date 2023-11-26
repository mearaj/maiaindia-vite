import { atom, AtomEffect } from 'recoil';
import { recoilKeys } from '@/recoil/data/recoilKeys';
import { appFirebaseAuth, appFirestore } from '@/firebase';
import {
  collection,
  FieldValue,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  where,
} from '@firebase/firestore';
import { onAuthStateChanged } from '@firebase/auth';
import { adminUsers, UserProfile } from '@/config';

export interface SupportChatUser {
  profile: UserProfile;
  chats: SupportChat[];
}

export const defaultChatUsers: SupportChatUser[] = adminUsers.map(
  (eachUser) => ({ profile: eachUser, chats: [] })
);

export interface SupportChatNoID {
  members: {
    [memberUID: string]: boolean;
  };
  createdAt: FieldValue;
  updatedAt: FieldValue;
  queryLimit?: number; // to be used only by frontend
}

export interface SupportChat extends SupportChatNoID {
  members: {
    [memberUID: string]: boolean;
  };
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface SupportChatSession {
  user: UserProfile;
  chat: SupportChat;
  messages: SupportChatMessage[];
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
      where(`members.${user.uid}`, '==', true),
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
            console.log('support chat modified, needed to be updated');
          } else if (change.type === 'removed') {
            console.log('support chat removed, needed to be updated');
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

export const supportChatUsersAtom = atom<SupportChatUser[]>({
  key: recoilKeys.supportChatUsersAtom,
  default: defaultChatUsers,
});
export const selectedSupportChatUserAtom = atom<SupportChatUser | null>({
  key: recoilKeys.selectedSupportChatUserAtom,
  default: null,
});

export const selectedSupportChatSessionAtom = atom<SupportChatSession | null>({
  key: recoilKeys.selectedSupportChatSessionAtom,
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

export interface SupportChatSessions {
  [supportChatID: string]: SupportChatSession;
}

export const supportChatSessionsAtom = atom<SupportChatSessions>({
  dangerouslyAllowMutability: false,
  key: recoilKeys.supportChatSessionsAtom,
  default: {},
});
