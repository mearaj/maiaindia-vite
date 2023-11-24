import {
  selectedSupportChatSessionAtom,
  selectedSupportChatUserAtom,
  SupportChat,
  SupportChatNoID,
} from '@/recoil/atoms/supportChat';
import Button from '@mui/material/Button';
import { useState } from 'react';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from '@firebase/firestore';
import { appFirestore } from '@/firebase';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userAtom } from '@/recoil/atoms';
import { Box } from '@mui/material';
import { supportChatsFilteredByUserID } from '@/recoil/selectors/supportChat';
import CommonPageLayout from '@/components/Layouts/CommonPage';
import { UserProfile } from '@/config';

interface SelectChatSessionProps {
  supportUser: UserProfile;
}

export default function SelectChatSession({
  supportUser,
}: SelectChatSessionProps) {
  const [loadingState, setLoadingState] = useState<'idle' | 'creatingSession'>(
    'idle'
  );
  const [error, setError] = useState<unknown>(null);
  const user = useRecoilValue(userAtom);
  const supportChats = useRecoilValue(
    supportChatsFilteredByUserID(supportUser.uid)
  );
  const setActiveChatSession = useSetRecoilState(
    selectedSupportChatSessionAtom
  );

  const setActiveChatUser = useSetRecoilState(selectedSupportChatUserAtom);

  const createNewSessionHandler = async () => {
    if (user) {
      setLoadingState('creatingSession');
      const collectionRef = collection(appFirestore, 'supportChats');

      try {
        const data: SupportChatNoID = {
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          members: {
            [supportUser.uid]: true,
            [user.user.uid]: true,
          },
        };
        const res = await addDoc(collectionRef, data);
        const docRef = doc(collectionRef, res.id);
        const afterSetRes = await getDoc(docRef);
        if (afterSetRes.exists()) {
          const supportChat = {
            ...(afterSetRes.data() as SupportChat),
            id: afterSetRes.id,
          };
          setActiveChatSession({ chat: supportChat, user: supportUser });
        } else {
          setError('Unknown error');
        }
      } catch (e: unknown) {
        setError(e);
      } finally {
        setLoadingState('idle');
      }
    }
  };

  let buttonText = 'Create New Session';
  if (loadingState === 'creatingSession') {
    buttonText = 'Creating Session...Please wait';
  }

  if (error) {
    return (
      <CommonPageLayout
        sxBodyProps={{
          alignItems: 'start',
          justifyContent: 'start',
          flexGrow: 0,
          padding: '16px',
        }}
      >
        <Box>{error.toString() ?? 'Unknown error'}</Box>
      </CommonPageLayout>
    );
  }

  return (
    <CommonPageLayout
      sxBodyProps={{
        alignItems: 'start',
        justifyContent: 'start',
        flexGrow: 0,
        padding: '16px',
      }}
      headerProps={{
        showBackIcon: true,
        onBackIconClick: () => {
          setActiveChatUser(null);
        },
      }}
    >
      {Object.keys(supportChats).map((eachChatID) => {
        return (
          <Button
            disabled={loadingState !== 'idle'}
            key={eachChatID}
            onClick={() => {
              setActiveChatSession({
                chat: supportChats[eachChatID],
                user: supportUser,
              });
            }}
          >
            {supportChats[eachChatID].id}
          </Button>
        );
      })}
      <Button
        disabled={loadingState !== 'idle'}
        onClick={createNewSessionHandler}
        fullWidth
      >
        {buttonText}
      </Button>
    </CommonPageLayout>
  );
}
