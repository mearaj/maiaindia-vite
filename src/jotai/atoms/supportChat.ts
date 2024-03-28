import { atom } from 'jotai';
import {
  appFirebaseAuth,
  appFirebaseStorage,
  appFirestore,
  updateDocsSnapshots,
} from '@/firebase';
import {
  collection,
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from '@firebase/firestore';
import { SupportChatSession } from '@/jotai/data/supportChat';
import { userAtom } from '@/jotai/atoms/user';
import { isAdminAtom } from '@/jotai/atoms/admin';
import { getDownloadURL, ref } from '@firebase/storage';
import { UserProfile } from '@/jotai/data/user';
import { atomEffect } from 'jotai-effect';
import { onAuthStateChanged } from '@firebase/auth';

export const currentUserLiveChatMaximizedAtom = atom<boolean>(false);

export const currentUserLastActiveChatSessionAtom =
  atom<SupportChatSession | null>(null);

export const currentUserLastActiveChatSessionAtomEffect = atomEffect(
  (get, set) => {
    let lastActiveChatSubscription = () => {};
    return onAuthStateChanged(appFirebaseAuth, async (user) => {
      if (!user) {
        set(currentUserLastActiveChatSessionAtom, null);
        lastActiveChatSubscription();
        return;
      }
      const supportChatsQuery = query(
        collection(appFirestore, 'supportChats'),
        orderBy('updatedAt', 'desc'),
        limit(1),
        where('customerID', '==', user.uid),
        where('status', '==', 'open')
      );
      lastActiveChatSubscription = onSnapshot(
        supportChatsQuery,
        async (supportChatsSnapshot) => {
          if (supportChatsSnapshot.metadata.hasPendingWrites) {
            return;
          }
          if (supportChatsSnapshot.empty) {
            set(currentUserLastActiveChatSessionAtom, null);
            return;
          }
          const currentLastChatSession = {
            ...(supportChatsSnapshot.docs[0].data() as SupportChatSession),
            id: supportChatsSnapshot.docs[0].id,
          };
          currentLastChatSession.customerProfile =
            get(userAtom).userState!.profile;
          if (
            currentLastChatSession.executiveID &&
            !currentLastChatSession.executiveProfile
          ) {
            const executiveProfileRef = doc(
              appFirestore,
              'users',
              currentLastChatSession.executiveID
            );
            const executiveDocSnapshot = await getDoc(executiveProfileRef);
            if (executiveDocSnapshot.exists()) {
              const photoUrlRef = ref(
                appFirebaseStorage,
                `users/${currentLastChatSession.executiveID}/profile`
              );
              const photoURL = await getDownloadURL(photoUrlRef);
              currentLastChatSession.executiveProfile = {
                ...(executiveDocSnapshot.data().profile as UserProfile),
                photoURL,
                id: currentLastChatSession.executiveID,
              };
            }
          }
          set(currentUserLastActiveChatSessionAtom, currentLastChatSession);
        }
      );
    });
  }
);

export const adminSupportChatSessions = atom<SupportChatSession[]>([]);
export const adminSupportChatSessionsEffect = atomEffect((get, set) => {
  const supportChatsQuery = query(
    collection(appFirestore, 'supportChats'),
    orderBy('updatedAt', 'desc'),
    where('status', '==', 'open')
  );
  return onSnapshot(supportChatsQuery, async (supportChatsSnapshot) => {
    if (supportChatsSnapshot.metadata.hasPendingWrites) {
      return;
    }
    const user = await get(userAtom);
    const isAdmin = get(isAdminAtom);
    const isValid = user.userState && isAdmin && !supportChatsSnapshot.empty;
    if (!isValid) {
      set(adminSupportChatSessions, []);
      return;
    }
    const prevSupportChatSessions = [...get(adminSupportChatSessions)];
    const newSupportChatSessions = updateDocsSnapshots(
      supportChatsSnapshot,
      prevSupportChatSessions
    ) as SupportChatSession[];
    for await (const eachSupportChat of newSupportChatSessions) {
      if (!eachSupportChat.customerProfile) {
        const customerProfileRef = doc(
          appFirestore,
          'users',
          eachSupportChat.customerID
        );
        const customerDocSnapshot = await getDoc(customerProfileRef);
        if (customerDocSnapshot.exists()) {
          const photoUrlRef = ref(
            appFirebaseStorage,
            `users/${customerDocSnapshot.id}/profile`
          );
          const photoURL = await getDownloadURL(photoUrlRef);
          eachSupportChat.customerProfile = {
            ...(customerDocSnapshot.data().profile as UserProfile),
            photoURL,
            id: eachSupportChat.customerID,
          };
        }
      }
      if (!eachSupportChat.executiveProfile && eachSupportChat.executiveID) {
        const executiveProfileRef = doc(
          appFirestore,
          'users',
          eachSupportChat.executiveID
        );
        const executiveDocSnapshot = await getDoc(executiveProfileRef);
        if (executiveDocSnapshot.exists()) {
          const photoUrlRef = ref(
            appFirebaseStorage,
            `users/${eachSupportChat.executiveID}/profile`
          );
          const photoURL = await getDownloadURL(photoUrlRef);
          eachSupportChat.executiveProfile = {
            ...(executiveDocSnapshot.data().profile as UserProfile),
            photoURL,
            id: eachSupportChat.executiveID,
          };
        }
      }
    }
    set(adminSupportChatSessions, newSupportChatSessions);
  });
});

export const adminActiveChatSessionAtom = atom<SupportChatSession | null>(null);
