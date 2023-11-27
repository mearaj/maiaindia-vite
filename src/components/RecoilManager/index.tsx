import { PropsWithChildren, useEffect } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import {
  SupportChat,
  SupportChatMessage,
  supportChatsAtom,
  supportChatsMessagesAtom,
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
import { userAtom } from '@/recoil/atoms';
import { adminUsers, isAdminUID, UserProfile } from '@/config';

export default function RecoilManager({ children }: PropsWithChildren) {
  const supportChats = useRecoilValue(supportChatsAtom);
  const supportChatUsers = useRecoilValue(supportChatUsersAtom);
  const appUser = useRecoilValue(userAtom);

  const updateSupportChatUsers = useRecoilCallback(
    ({ snapshot, set }) =>
      async () => {
        const prevChatUsersArr =
          await snapshot.getPromise(supportChatUsersAtom);
        const prevChatUsersMap = prevChatUsersArr.reduce(
          (prev, curr) => ({
            ...prev,
            [curr.uid]: curr,
          }),
          {} as {
            [userID: string]: UserProfile;
          }
        );
        let currentChatUsers: UserProfile[] = [...adminUsers];
        for await (const supportChat of supportChats) {
          for await (const eachMemberUID of [
            supportChat.createdBy,
            supportChat.createdFor,
          ]) {
            const foundChatUserIndex = currentChatUsers.findIndex(
              (eachUser) => eachUser.uid === eachMemberUID
            );
            if (foundChatUserIndex < 0) {
              const foundChatUser = prevChatUsersMap[eachMemberUID];
              if (foundChatUser) {
                currentChatUsers.push(foundChatUser);
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
                currentChatUsers.push(userProfile);
              }
            }
          }
        }
        // make each element unique in array
        currentChatUsers = currentChatUsers.filter(
          (eachUser, index, arr) =>
            index ===
            arr.findIndex((eachElement) => eachElement.uid === eachUser.uid)
        );
        // Allow self chat only for admin
        if (appUser.userState && !isAdminUID(appUser.userState.user.uid)) {
          const foundIndex = currentChatUsers.findIndex(
            (eachUser) => eachUser.uid === appUser.userState?.user.uid
          );
          if (foundIndex >= 0) {
            currentChatUsers.splice(foundIndex, 1);
          }
        }
        console.log(currentChatUsers);
        set(supportChatUsersAtom, currentChatUsers);
      },
    [appUser.userState, supportChats]
  );

  const updateSupportChatSessions = useRecoilCallback(
    ({ snapshot, set }) =>
      async (supportChat: SupportChat, messages: SupportChatMessage[]) => {
        let supportChatSessions = {
          ...(await snapshot.getPromise(supportChatsMessagesAtom)),
        };
        if (supportChatSessions[supportChat.id]) {
          supportChatSessions = {
            ...supportChatSessions,
            [supportChat.id]: messages,
          };
        } else {
          supportChatSessions = {
            ...supportChatSessions,
            [supportChat.id]: messages,
          };
        }
        set(supportChatsMessagesAtom, supportChatSessions);
      },
    []
  );

  useEffect(() => {
    const subscriptions: Function[] = [];
    for (const eachChat of supportChats) {
      const collectionRef = collection(
        appFirestore,
        'supportChats',
        eachChat.id,
        'supportChatMessages'
      );
      const supportChatQuery = query(
        collectionRef,
        limit(eachChat.queryLimit ?? 10),
        orderBy('updatedAt', 'desc')
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
        await updateSupportChatSessions(eachChat, messages);
      });
      subscriptions.push(subscription);
    }
    return () => {
      return subscriptions.forEach((subscription) => subscription());
    };
  }, [supportChatUsers, supportChats, updateSupportChatSessions]);

  useEffect(() => {
    updateSupportChatUsers();
  }, [supportChats, updateSupportChatUsers]);

  return children;
}
