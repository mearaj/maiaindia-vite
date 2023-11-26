import { PropsWithChildren, useEffect } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import {
  selectedSupportChatSessionAtom,
  selectedSupportChatUserAtom,
  SupportChat,
  SupportChatMessage,
  supportChatsAtom,
  supportChatSessionsAtom,
  SupportChatUser,
  supportChatUsersAtom,
} from '@/recoil/atoms/supportChat';
import { appFirestore } from '@/firebase';
import {
  collection,
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
} from '@firebase/firestore';
import { adminUsers, UserProfile } from '@/config';

export default function RecoilManager({ children }: PropsWithChildren) {
  const supportChats = useRecoilValue(supportChatsAtom);
  const supportChatUsers = useRecoilValue(supportChatUsersAtom);

  const updateSupportChatUsers = useRecoilCallback(
    ({ snapshot, set }) =>
      async () => {
        const prevChatUsersArr =
          await snapshot.getPromise(supportChatUsersAtom);
        const prevChatUsersMap = prevChatUsersArr.reduce(
          (prev, curr) => ({
            ...prev,
            [curr.profile.uid]: curr.profile,
          }),
          {} as {
            [userID: string]: UserProfile;
          }
        );
        const currentChatUsers: SupportChatUser[] = adminUsers.map(
          (eachUser) => ({ profile: eachUser, chats: [] })
        );
        for await (const supportChat of supportChats) {
          for await (const eachMemberUID of Object.keys(supportChat.members)) {
            const foundChatUserIndex = currentChatUsers.findIndex(
              (eachUser) => eachUser.profile.uid === eachMemberUID
            );
            if (foundChatUserIndex < 0) {
              const foundChatUser = prevChatUsersMap[eachMemberUID];
              if (foundChatUser) {
                currentChatUsers.push({
                  chats: [supportChat],
                  profile: foundChatUser,
                });
              } else {
                const userDocQuery = doc(appFirestore, 'users', eachMemberUID);
                const userDocRef = await getDoc(userDocQuery);
                let userProfile: UserProfile = { uid: eachMemberUID };
                if (userDocRef.exists()) {
                  userProfile = {
                    ...userDocRef.data().profile,
                    uid: eachMemberUID,
                  };
                }
                currentChatUsers.push({
                  chats: [supportChat],
                  profile: userProfile,
                });
              }
            } else {
              currentChatUsers[foundChatUserIndex].chats.push(supportChat);
            }
          }
        }
        const activeSupportChatUser = await snapshot.getPromise(
          selectedSupportChatUserAtom
        );
        if (activeSupportChatUser) {
          const foundChatUser = currentChatUsers.find(
            (eachUser) =>
              eachUser.profile.uid === activeSupportChatUser.profile.uid
          );
          if (foundChatUser) {
            set(selectedSupportChatUserAtom, foundChatUser);
          }
        }
        set(supportChatUsersAtom, currentChatUsers);
      },
    [supportChats]
  );

  const updateSupportChatSessions = useRecoilCallback(
    ({ snapshot, set }) =>
      async (
        chatUser: SupportChatUser,
        supportChat: SupportChat,
        messages: SupportChatMessage[]
      ) => {
        let supportChatSessions = {
          ...(await snapshot.getPromise(supportChatSessionsAtom)),
        };
        if (supportChatSessions[supportChat.id]) {
          supportChatSessions = {
            ...supportChatSessions,
            [supportChat.id]: {
              user: chatUser.profile,
              chat: supportChat,
              messages,
            },
          };
        } else {
          supportChatSessions = {
            ...supportChatSessions,
            [supportChat.id]: {
              user: chatUser.profile,
              chat: supportChat,
              messages,
            },
          };
        }
        const activeChatSession = await snapshot.getPromise(
          selectedSupportChatSessionAtom
        );
        if (activeChatSession && activeChatSession.chat.id === supportChat.id) {
          set(selectedSupportChatSessionAtom, {
            user: chatUser.profile,
            chat: supportChat,
            messages,
          });
        }
        set(supportChatSessionsAtom, supportChatSessions);
      },
    []
  );

  useEffect(() => {
    const subscriptions: Function[] = [];
    for (const supportChatUser of supportChatUsers) {
      for (const eachChat of supportChatUser.chats) {
        const collectionRef = collection(
          appFirestore,
          'supportChats',
          eachChat.id,
          'supportChatMessages'
        );
        const supportChatQuery = query(
          collectionRef,
          limit(10),
          orderBy('createdAt', 'desc')
        );
        const subscription = onSnapshot(supportChatQuery, async (snapshot) => {
          const messages: SupportChatMessage[] = [];
          snapshot.docs.forEach((eachDoc) => {
            if (eachDoc.exists()) {
              messages.push({
                ...(eachDoc.data() as SupportChatMessage),
                id: eachDoc.id,
              });
            }
          });
          await updateSupportChatSessions(supportChatUser, eachChat, messages);
        });
        subscriptions.push(subscription);
      }
    }
    return () => {
      return subscriptions.forEach((subscription) => subscription());
    };
  }, [supportChatUsers, updateSupportChatSessions]);

  useEffect(() => {
    updateSupportChatUsers();
  }, [supportChats, updateSupportChatUsers]);

  return children;
}
