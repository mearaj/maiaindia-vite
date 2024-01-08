import { Chat } from '@mui/icons-material';
import { alpha, Box, Card, IconButton, useTheme } from '@mui/material';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userAtom } from '@/recoil/atoms';
import { selectedDialogAtom } from '@/recoil/atoms/dialog';
import { ReactNode, useState } from 'react';
import { currentUserLastActiveChatSessionAtom } from '@/recoil/atoms/supportChat';
import Button from '@mui/material/Button';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from '@firebase/firestore';
import { appFirestore } from '@/firebase';
import ChatTabsComponent from '@/components/LiveChat/ChatTabs';
import SignInRequiredDialog from '@/components/Dialogs/SignInRequired';
import CommonHeader from '@/components/Layouts/CommonHeader';
import SignInButton from '@/components/Buttons/SignIn';
import useDimensions from '@/hooks/useDimensions';

export default function LiveChatButton() {
  const theme = useTheme();
  const [isUIMaximized, setIsUIMaximized] = useState(false);
  const setActiveDialog = useSetRecoilState(selectedDialogAtom);
  const user = useRecoilValue(userAtom);
  const dimensions = useDimensions();
  const lastActiveChatSession = useRecoilValue(
    currentUserLastActiveChatSessionAtom
  );
  const onClickHandler = () => {
    if (!user.userState) {
      setActiveDialog(<SignInRequiredDialog />);
      return;
    }
    setIsUIMaximized(!isUIMaximized);
  };

  const handleCreateNewSession = async () => {
    const docRef = await addDoc(collection(appFirestore, 'supportChats'), {
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      customerID: user.userState?.user.uid,
      status: 'open',
    });
    await getDoc(doc(appFirestore, 'supportChats', docRef.id));
  };

  const centerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    textAlign: 'center',
  };
  let mainComponent: ReactNode;
  // If user is not logged in
  if (!user.userState) {
    mainComponent = (
      <Box sx={centerStyle}>
        <SignInButton />
      </Box>
    );
  } else if (lastActiveChatSession != null) {
    mainComponent = <ChatTabsComponent chatSession={lastActiveChatSession} />;
  } else {
    mainComponent = (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          overflowY: 'auto',
          height: '100%',
          padding: '16px',
        }}
      >
        <Box
          sx={{
            textAlign: 'center',
            fontSize: '20px',
            fontWeight: 'bold',
          }}
        >
          Maia India Customer Chat Service Welcomes You!
        </Box>
        <Box
          sx={{
            textAlign: 'center',
            fontSize: '18px',
            fontWeight: 'normal',
          }}
        >
          It seems that you don&apos;t have any active chat session.
          <br />
          Kindly click the button below to start a new chat session.
        </Box>
        <Button variant="contained" onClick={handleCreateNewSession}>
          Create New Session
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: '16px',
        right: '16px',
        minWidth: '0px',
        minHeight: '0px',
        padding: '0px',
        borderRadius: '50%',
        display: 'flex',
        zIndex: theme.zIndex.appBar,
      }}
    >
      <Card
        sx={{
          padding: '0px',
          bottom: '60px',
          right: '8px',
          height: isUIMaximized ? `${dimensions.height}px` : '0vh',
          width: '100vw',
          maxHeight: `min(800px, calc(${dimensions.height}px - 140px))`,
          maxWidth: `min(600px, calc(${dimensions.width}px - 48px))`,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'white',
          position: 'absolute',
          transition: 'height 350ms,width 350ms',
        }}
      >
        <CommonHeader
          onBackIconClick={lastActiveChatSession != null ? () => {} : undefined}
          onMinimizeClick={
            lastActiveChatSession != null
              ? () => {
                  setIsUIMaximized(!isUIMaximized);
                }
              : undefined
          }
          centerComponent={
            lastActiveChatSession != null ? (
              <Box
                sx={{
                  color: theme.palette.secondary.main,
                  display: 'flex',
                  justifyContent: 'center',
                  fontSize: '18px',
                }}
              >
                Customer Support
              </Box>
            ) : undefined
          }
        />
        <Box sx={{ height: `calc(100% - ${theme.dimensions.appBarHeight}px)` }}>
          {mainComponent}
        </Box>
      </Card>
      <IconButton
        color="secondary"
        onClick={onClickHandler}
        sx={{
          padding: '12px',
          backgroundColor: alpha(theme.palette.primary.main, 0.85),
          '&:active,&:hover,&:focus': {
            backgroundColor: alpha(theme.palette.primary.main, 0.85),
          },
        }}
      >
        <Chat
          sx={{
            fontSize: '32px',
          }}
        />
      </IconButton>
    </Box>
  );
}
