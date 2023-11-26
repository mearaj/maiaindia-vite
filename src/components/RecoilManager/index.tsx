import { PropsWithChildren, useEffect } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import {
  selectedSupportChatUserAtom,
  supportChatsAtom,
  SupportChatUser,
  supportChatUsersAtom,
} from '@/recoil/atoms/supportChat';
import { appFirestore } from '@/firebase';
import { doc, getDoc } from '@firebase/firestore';
import { adminUsers, UserProfile } from '@/config';

export default function RecoilManager({ children }: PropsWithChildren) {
  const supportChats = useRecoilValue(supportChatsAtom);

  const updateSupportChatsDependencies = useRecoilCallback(
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

  useEffect(() => {
    updateSupportChatsDependencies();
  }, [supportChats, updateSupportChatsDependencies]);

  return children;
}
