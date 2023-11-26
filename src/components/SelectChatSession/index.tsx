import {
  selectedSupportChatSessionAtom,
  selectedSupportChatUserAtom,
  SupportChat,
  SupportChatMessage,
  SupportChatNoID,
  supportChatSessionsAtom,
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
  const { userState } = useRecoilValue(userAtom);
  const setActiveChatSession = useSetRecoilState(
    selectedSupportChatSessionAtom
  );
  const supportChatSessions = useRecoilValue(supportChatSessionsAtom);

  const setActiveChatUser = useSetRecoilState(selectedSupportChatUserAtom);

  const createNewSessionHandler = async () => {
    if (userState) {
      setLoadingState('creatingSession');
      const collectionRef = collection(appFirestore, 'supportChats');

      try {
        const data: SupportChatNoID = {
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          members: {
            [supportUser.profile.uid]: true,
            [userState.user.uid]: true,
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
          setActiveChatSession({
            chat: supportChat,
            user: supportUser.profile,
            messages: [],
          });
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
      {supportUser.chats
        .filter((eachChat) => supportChatSessions[eachChat.id])
        .map((eachSupportChat) => {
          let messages: SupportChatMessage[] = [];
          if (supportChatSessions[eachSupportChat.id]) {
            messages = supportChatSessions[eachSupportChat.id].messages;
          }
          return (
            <Button
              disabled={loadingState !== 'idle'}
              key={eachSupportChat.id}
              onClick={() => {
                setActiveChatSession({
                  chat: eachSupportChat,
                  user: supportUser.profile,
                  messages,
                });
              }}
            >
              {eachSupportChat.id}
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
