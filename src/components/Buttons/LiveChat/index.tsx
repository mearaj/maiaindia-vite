import { Chat } from '@mui/icons-material';
import { Box, Card, Typography, useTheme } from '@mui/material';
import Button from '@mui/material/Button';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userAtom } from '@/recoil/atoms';
import { selectedDialogAtom } from '@/recoil/atoms/dialog';
import { useState } from 'react';
import SignInRequiredDialog from '@/components/Dialogs/SignInRequired';
import CommonHeader from '@/components/Layouts/CommonHeader';
import SignInButton from '@/components/Buttons/SignIn';

export default function LiveChatButton() {
  const theme = useTheme();
  const [liveChatState, setLiveChatState] = useState(false);
  const setActiveDialog = useSetRecoilState(selectedDialogAtom);
  const user = useRecoilValue(userAtom);

  const onClickHandler = () => {
    if (!user.userState) {
      setActiveDialog(<SignInRequiredDialog />);
      return;
    }
    setLiveChatState(!liveChatState);
  };

  return (
    <Button
      color="secondary"
      sx={{
        position: 'fixed',
        bottom: '32px',
        right: '16px',
        minWidth: '0px',
        minHeight: '0px',
        padding: '12px',
        borderRadius: '50%',
        backgroundColor: theme.palette.primary.main,
        '&:active,&:hover,&:focus': {
          backgroundColor: theme.palette.primary.main,
        },
        zIndex: theme.zIndex.appBar,
      }}
      onClick={onClickHandler}
    >
      <Card
        sx={{
          padding: '0px',
          bottom: '48px',
          right: '8px',
          height: liveChatState ? '100vh' : '0vh',
          width: liveChatState ? '100vw' : '0vw',
          maxHeight: `min(800px, calc(100vh - 150px))`,
          maxWidth: 'min(600px, calc(100vw - 64px))',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'white',
          position: 'absolute',
          transition: 'height 350ms,width 350ms',
        }}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
      >
        <CommonHeader
          onCloseClick={() => {
            setLiveChatState(!liveChatState);
          }}
        />
        {!user.userState ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <SignInButton />
          </Box>
        ) : (
          <Box>
            <Typography> User is signed in</Typography>
          </Box>
        )}
      </Card>
      <Chat
        sx={{
          fontSize: '32px',
        }}
      />
    </Button>
  );
}
