import { useEffect } from 'react';
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
  limit,
  onSnapshot,
  orderBy,
  query,
} from '@firebase/firestore';

export default function RecoilManager() {
  const supportChats = useRecoilValue(supportChatsAtom);
  const supportChatUsers = useRecoilValue(supportChatUsersAtom);
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

  return null;
}
