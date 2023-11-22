import { atom, AtomEffect } from 'recoil';
import { recoilKeys } from '@/recoil/data/recoilKeys';
import { appFirebaseAuth, appFirestore } from '@/firebase';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  Timestamp,
  where,
} from '@firebase/firestore';
import { onAuthStateChanged } from '@firebase/auth';
import { adminUsers, UserProfile } from '@/config';

export interface SupportChatUsers {
  [toUserUID: string]: SupportChatUser;
}

export interface SupportChatUser {
  user: UserProfile;
  sessions: {
    [sessionID: string]: SupportChat;
  };
}

export interface SupportChatNoID {
  members: {
    [memberUID: string]: boolean;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface SupportChat extends SupportChatNoID {
  id: string;
}

export interface SupportChatSession {
  user: UserProfile;
  chat: SupportChat;
}

const defaultChatSessions = adminUsers.reduce((prev, curr) => {
  return {
    ...prev,
    [curr.uid]: {
      user: curr,
      sessions: [],
    },
  };
}, {}) as SupportChatUsers;

const querySupportChatsSideEffects: AtomEffect<SupportChatUsers> = ({
  setSelf,
  getPromise,
  node,
}) => {
  let supportChatsSubscription = () => {};
  const authSubscription = onAuthStateChanged(appFirebaseAuth, async (user) => {
    if (user === null) {
      setSelf(defaultChatSessions);
      return;
    }
    const collectionReference = collection(appFirestore, 'supportChats');
    const supportChatsQuery = query(
      collectionReference,
      where(`members.${user.uid}`, '==', true)
    );
    supportChatsSubscription = onSnapshot(supportChatsQuery, async (val) => {
      if (!val.empty) {
        let currentChatSessions = { ...(await getPromise(node)) };
        for await (const result of val.docs) {
          if (result.exists()) {
            const chatSession = {
              ...result.data(),
              id: result.id,
            } as SupportChat;
            for await (const eachMember of Object.keys(chatSession.members)) {
              let foundUser: UserProfile | null = null;
              if (currentChatSessions[eachMember]) {
                foundUser = currentChatSessions[eachMember].user;
              }
              if (foundUser) {
                const sessions =
                  currentChatSessions[foundUser.uid].sessions ?? {};
                currentChatSessions = {
                  ...currentChatSessions,
                  [foundUser.uid]: {
                    user,
                    sessions: {
                      ...sessions,
                      [chatSession.id]: {
                        id: chatSession.id,
                        createdAt: chatSession.createdAt,
                        updatedAt: chatSession.updatedAt,
                        members: chatSession.members,
                      },
                    },
                  },
                };
              } else {
                const userDocQuery = doc(appFirestore, 'users', eachMember);
                const userDocRef = await getDoc(userDocQuery);
                let userProfile: UserProfile = { uid: eachMember };
                if (userDocRef.exists()) {
                  userProfile = {
                    ...userProfile,
                    ...(userDocRef.data()?.profile ?? {}),
                  };
                  const sessions =
                    currentChatSessions[userProfile.uid].sessions ?? {};
                  currentChatSessions = {
                    ...currentChatSessions,
                    [userProfile.uid]: {
                      user,
                      sessions: {
                        ...sessions,
                        [chatSession.id]: {
                          id: chatSession.id,
                          createdAt: chatSession.createdAt,
                          updatedAt: chatSession.updatedAt,
                          members: chatSession.members,
                        },
                      },
                    },
                  };
                }
              }
            }
          }
        }
        setSelf(currentChatSessions);
      }
    });
  });
  return () => {
    supportChatsSubscription();
    authSubscription();
  };
};
export const supportChatUsersAtom = atom<SupportChatUsers>({
  key: recoilKeys.supportChatUsersAtom,
  default: defaultChatSessions,
  effects: [querySupportChatsSideEffects],
});
export const selectedSupportChatUserAtom = atom<SupportChatUser | null>({
  key: recoilKeys.selectedSupportChatUserAtom,
  default: null,
});

export const selectedSupportChatSessionAtom = atom<SupportChatSession | null>({
  key: recoilKeys.selectedSupportChatSessionAtom,
  default: null,
});
