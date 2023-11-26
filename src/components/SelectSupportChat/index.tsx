import {
  selectedSupportChat,
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
import { Box, Card } from '@mui/material';
import { supportChatsFilteredByUserID } from '@/recoil/selectors/supportChat';
import CommonPageLayout from '@/components/Layouts/CommonPage';
import { UserProfile } from '@/config';

interface SelectChatSessionProps {
  supportUser: UserProfile;
}

export default function SelectSupportChatComponent({
  supportUser,
}: SelectChatSessionProps) {
  const [loadingState, setLoadingState] = useState<'idle' | 'creatingSession'>(
    'idle'
  );
  const [error, setError] = useState<unknown>(null);
  const { userState } = useRecoilValue(userAtom);
  const setActiveChatID = useSetRecoilState(selectedSupportChat);
  const supportChatsForUser = useRecoilValue(
    supportChatsFilteredByUserID(supportUser.uid)
  );

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
            [supportUser.uid]: true,
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
          setActiveChatID(supportChat);
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
        alignItems: 'stretch',
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
      {supportChatsForUser.map((eachSupportChat) => {
        return (
          <Card key={eachSupportChat.id} sx={{ marginBottom: '16px' }}>
            <Button
              disabled={loadingState !== 'idle'}
              onClick={() => {
                setActiveChatID(eachSupportChat);
              }}
            >
              {eachSupportChat.id}
            </Button>
            <Box
              sx={{ display: 'flex', padding: '0 8px', alignItems: 'center' }}
            >
              <Box sx={{ fontSize: '14px' }}>Last updated at:&nbsp;</Box>
              <Box sx={{ fontSize: '12px' }}>
                {eachSupportChat.updatedAt?.toDate().toDateString()}
              </Box>
            </Box>
          </Card>
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
