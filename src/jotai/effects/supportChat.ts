import { appFirestore, updateDocsSnapshots } from '@/firebase';
import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from '@firebase/firestore';
import { MessageState, SupportChatSession } from '@/jotai/data/supportChat';
import { userAtom } from '@/jotai/atoms/user';
import { atomEffect } from 'jotai-effect';
import { allUsersForAdminAtom, isAdminAtom } from '@/jotai/atoms/admin';
import {
  adminSupportChatSessionsAtom,
  userToAdminChatSessionAtom,
} from '@/jotai/atoms/supportChat';

export const userToAdminChatSessionAtomEffect = atomEffect((get, set) => {
  let user = get(userAtom);
  if (!user || !user.userState || !user.userState.user) {
    set(userToAdminChatSessionAtom, null);
    return () => {};
  }
  const supportChatsQuery = query(
    collection(appFirestore, 'supportChats'),
    orderBy('updatedAt', 'desc'),
    limit(1),
    where('customerID', '==', user.userState.user.uid),
    where('status', '==', 'open')
  );
  return onSnapshot(supportChatsQuery, async (supportChatsSnapshot) => {
    user = get(userAtom);
    if (
      !user ||
      !user.userState ||
      !user.userState.user ||
      supportChatsSnapshot.empty
    ) {
      set(userToAdminChatSessionAtom, null);
      return;
    }
    const currentLastChatSession = {
      ...(supportChatsSnapshot.docs[0].data() as SupportChatSession),
      id: supportChatsSnapshot.docs[0].id,
    };
    const { hasPendingWrites } = supportChatsSnapshot.metadata;
    if (!hasPendingWrites) {
      const userID = user.userState.user.uid;
      let updateRequired = false;
      const copiedSession = { ...currentLastChatSession };
      copiedSession.messages = copiedSession.messages.map((eachMessage) => {
        return {
          ...eachMessage,
        };
      });
      for (const message of copiedSession.messages) {
        if (message.from === userID && message.state === MessageState.Created) {
          message.state = MessageState.ReachedServer;
          updateRequired = true;
        }
      }
      if (updateRequired) {
        try {
          copiedSession.updatedAt = serverTimestamp();
          const chatSessionRef = doc(
            appFirestore,
            'supportChats',
            copiedSession.id
          );
          await setDoc(chatSessionRef, copiedSession, {
            mergeFields: ['updatedAt', 'messages'],
          });
        } catch (e) {
          console.log(e);
        }
      }
    }
    set(userToAdminChatSessionAtom, currentLastChatSession);
  });
});

export const adminSupportChatSessionsEffect = atomEffect((get, set) => {
  let user = get(userAtom);
  let isAdmin = get(isAdminAtom);
  let isValid = user.userState && isAdmin;
  if (!isValid) {
    set(adminSupportChatSessionsAtom, []);
    return () => {};
  }
  const supportChatsQuery = query(
    collection(appFirestore, 'supportChats'),
    orderBy('updatedAt', 'desc'),
    where('status', '==', 'open')
  );
  return onSnapshot(supportChatsQuery, async (supportChatsSnapshot) => {
    if (supportChatsSnapshot.metadata.hasPendingWrites) {
      return;
    }
    user = get(userAtom);
    isAdmin = get(isAdminAtom);
    isValid = user.userState && isAdmin && !supportChatsSnapshot.empty;
    if (!isValid) {
      set(adminSupportChatSessionsAtom, []);
      return;
    }
    const prevSupportChatSessions = get(adminSupportChatSessionsAtom);
    const newSupportChatSessions = updateDocsSnapshots(
      supportChatsSnapshot,
      prevSupportChatSessions
    ) as SupportChatSession[];
    const allUsersMap = get(allUsersForAdminAtom);
    for (const [index, eachSupportChat] of newSupportChatSessions.entries()) {
      if (!newSupportChatSessions[index].customer) {
        if (allUsersMap[eachSupportChat.customerID]) {
          newSupportChatSessions[index].customer =
            allUsersMap[eachSupportChat.customerID];
        }
      }
    }
    set(adminSupportChatSessionsAtom, [...newSupportChatSessions]);
  });
});
