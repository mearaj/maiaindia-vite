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
import { UserProfile } from '@/config';

export interface SupportChatUsers {
  [toUserUID: string]: UserProfile;
}

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

export interface SupportChats {
  [supportChatID: string]: SupportChat;
}

export interface SupportChatSession {
  user: UserProfile;
  chat: SupportChat;
}

const querySupportChatsSideEffects: AtomEffect<SupportChats> = ({
  setSelf,
  getPromise,
  node,
}) => {
  let supportChatsSubscription = () => {};
  const authSubscription = onAuthStateChanged(appFirebaseAuth, async (user) => {
    if (user === null) {
      setSelf({});
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
        let supportChats: SupportChats = { ...(await getPromise(node)) };
        snapshot.docChanges().forEach((change) => {
          const { id } = change.doc;
          if (change.type === 'added' || change.type === 'modified') {
            const supportChat: SupportChat = {
              ...(change.doc.data() as SupportChat),
              id,
            };
            supportChats = { ...supportChats, [id]: supportChat };
          } else if (change.type === 'removed') {
            delete supportChats[id];
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

export const supportChatsAtom = atom<SupportChats>({
  key: recoilKeys.supportChatsAtom,
  default: {},
  effects: [querySupportChatsSideEffects],
});
export const selectedSupportChatUserAtom = atom<UserProfile | null>({
  key: recoilKeys.selectedSupportChatUserAtom,
  default: null,
});

export const selectedSupportChatSessionAtom = atom<SupportChatSession | null>({
  key: recoilKeys.selectedSupportChatSessionAtom,
  default: null,
});

export interface SupportChatsQueries {
  [sessionID: string]: {
    limit: number;
  };
}

export const supportChatsQueriesAtom = atom<SupportChatsQueries>({
  dangerouslyAllowMutability: false,
  key: recoilKeys.supportChatsQueriesAtom,
  default: {},
});
