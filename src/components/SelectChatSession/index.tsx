import {
  selectedSupportChatSessionAtom,
  selectedSupportChatUserAtom,
  SupportChat,
  SupportChatNoID,
  SupportChatUser,
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
import CommonPageLayout from '@/components/Layouts/CommonPage';

interface SelectChatSessionProps {
  supportUser: SupportChatUser;
}

export default function SelectChatSession({
  supportUser,
}: SelectChatSessionProps) {
  const [loadingState, setLoadingState] = useState<'idle' | 'creatingSession'>(
    'idle'
  );
  const [error, setError] = useState<unknown>(null);
  const user = useRecoilValue(userAtom);
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
            [supportUser.user.uid]: true,
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
          setActiveChatSession({ chat: supportChat, user: supportUser.user });
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
      {Object.keys(supportUser.sessions).map((eachSession) => {
        return (
          <Button
            disabled={loadingState !== 'idle'}
            key={eachSession}
            onClick={() => {
              setActiveChatSession({
                chat: supportUser.sessions[eachSession],
                user: supportUser.user,
              });
            }}
          >
            {supportUser.sessions[eachSession].id}
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
