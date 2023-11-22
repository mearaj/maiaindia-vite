import { atom } from 'recoil';
import { recoilKeys } from '@/recoil/data/recoilKeys';
import { appFirebaseAuth, appFirestore } from '@/firebase';
import {
  collection,
  onSnapshot,
  query,
  Timestamp,
  where,
} from '@firebase/firestore';
import { onAuthStateChanged } from '@firebase/auth';
import { adminUsers, ChatUser } from '@/config';

export interface ChatSessions {
  [toUserUID: string]: ChatSessionsItem;
}

export interface ChatSessionsItem {
  to: ChatUser;
  sessions: ChatSession[];
}

export interface ChatSession {
  to: ChatUser;
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  messages: [];
}

const defaultChatSessions = adminUsers.reduce((prev, curr) => {
  return {
    ...prev,
    [curr.uid]: {
      to: curr,
      sessions: [],
    },
  };
}, {}) as ChatSessions;
export const chatSessionsAtom = atom<ChatSessions>({
  key: recoilKeys.chatSessionsAtom,
  default: defaultChatSessions,
  effects: [
    ({ setSelf, getPromise, node }) => {
      let supportChatsSubscription = () => {};
      const authSubscription = onAuthStateChanged(
        appFirebaseAuth,
        async (user) => {
          if (user === null) {
            setSelf(defaultChatSessions);
            return;
          }
          const collectionReference = collection(appFirestore, 'supportChats');
          const supportChatsQuery = query(
            collectionReference,
            where(`members.${user.uid}`, '==', true)
          );
          supportChatsSubscription = onSnapshot(
            supportChatsQuery,
            async (val) => {
              if (!val.empty) {
                const currentChatSessions = await getPromise(node);
                val.forEach((result) => {
                  if (result.exists()) {
                    const chatSession = { ...result.data(), id: result.id } as {
                      members: { [memberID: string]: boolean };
                      id: string;
                      createdAt: Timestamp;
                      updatedAt: Timestamp;
                    };
                    const foundUserUID = Object.keys(currentChatSessions).find(
                      (eachUserUid) => {
                        return Object.keys(chatSession.members).find(
                          (memberUserUid) => eachUserUid === memberUserUid
                        );
                      }
                    );
                    if (foundUserUID) {
                      const foundSession = currentChatSessions[
                        foundUserUID
                      ].sessions.find(
                        (eachSession) => eachSession.id === chatSession.id
                      );
                      if (!foundSession) {
                        const newChatSessions: ChatSessions = {
                          ...currentChatSessions,
                          [foundUserUID]: {
                            to: currentChatSessions[foundUserUID].to,
                            sessions: [
                              ...currentChatSessions[foundUserUID].sessions,
                              {
                                to: currentChatSessions[foundUserUID].to,
                                id: chatSession.id,
                                createdAt: chatSession.createdAt,
                                updatedAt: chatSession.updatedAt,
                                messages: [],
                              },
                            ],
                          },
                        };
                        setSelf(newChatSessions);
                        console.log(newChatSessions);
                      }
                    } else {
                      console.log('user not found');
                    }
                  }
                });
              }
            }
          );
        }
      );
      return () => {
        supportChatsSubscription();
        authSubscription();
      };
    },
  ],
});
export const selectedChatSession = atom<ChatSession | null>({
  key: recoilKeys.selectedChatSessionAtom,
  default: null,
});
