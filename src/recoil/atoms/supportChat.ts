import { atom, AtomEffect } from 'recoil';
import { recoilKeys } from '@/recoil/data/recoilKeys';
import { appFirebaseAuth, appFirestore } from '@/firebase';
import {
  collection,
  FieldValue,
  onSnapshot,
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
      where(`members.${user.uid}`, '==', true)
    );
    supportChatsSubscription = onSnapshot(
      supportChatsQuery,
      async (snapshot) => {
        const supportChats: SupportChat[] = [];
        snapshot.docs.forEach((supportChat) => {
          if (supportChat.exists()) {
            supportChats.push({
              ...(supportChat.data() as SupportChat),
              id: supportChat.id,
            });
          }
        });
        // snapshot.docChanges().forEach((change) => {
        //   const { id } = change.doc;
        //   if (change.type === 'added') {
        //     const supportChat: SupportChat = {
        //       ...(change.doc.data() as SupportChat),
        //       id,
        //     };
        //     supportChats.push(supportChat);
        //   } else if (change.type === 'modified') {
        //     console.log('modified');
        //   } else if (change.type === 'removed') {
        //     console.log('removed');
        //   }
        // });
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

export interface SupportChatMessage {
  from: string;
  to: string;
  text: string;
  attachments: MessageAttachment[] | MessageAttachmentNoID | null;
  type: string;
}

export interface SupportChatSessions {
  [supportChatID: string]: SupportChatSession;
}

export const supportChatSessionsAtom = atom<SupportChatSessions>({
  dangerouslyAllowMutability: false,
  key: recoilKeys.supportChatSessionsAtom,
  default: {},
});
