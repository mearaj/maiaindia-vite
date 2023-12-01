import { useRecoilCallback, useRecoilValue } from 'recoil';
import {
  supportChatsAtom,
  supportChatUsersAtom,
} from '@/recoil/atoms/supportChat';
import { appFirestore } from '@/firebase';
import { doc, getDoc } from '@firebase/firestore';
import { userAtom } from '@/recoil/atoms';
import { useEffect } from 'react';
import { adminUsers, UserProfile } from '@/config';

export default function SupportChatUsersSideEffects() {
  const supportChats = useRecoilValue(supportChatsAtom);
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
        // make each element unique in array and remove self to disallow Self Chat
        currentChatUsers = currentChatUsers.filter(
          (eachUser, index, arr) =>
            index ===
            arr.findIndex(
              (eachElement) =>
                eachElement.uid === eachUser.uid &&
                eachUser.uid !== appUser.userState?.user.uid
            )
        );
        // Allow self chat only for admin (Disallow for non admins)
        // if (appUser.userState && !isAdminUID(appUser.userState.user.uid)) {
        //   const foundIndex = currentChatUsers.findIndex(
        //     (eachUser) => eachUser.uid === appUser.userState?.user.uid
        //   );
        //   if (foundIndex >= 0) {
        //     currentChatUsers.splice(foundIndex, 1);
        //   }
        // }
        set(supportChatUsersAtom, currentChatUsers);
      },
    [appUser.userState, supportChats]
  );

  useEffect(() => {
    updateSupportChatUsers();
  }, [supportChats, updateSupportChatUsers]);

  return null;
}
