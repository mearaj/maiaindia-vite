import { Chat } from '@mui/icons-material';
import {
  alpha,
  Box,
  Card,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userAtom } from '@/recoil/atoms';
import { selectedDialogAtom } from '@/recoil/atoms/dialog';
import { useState } from 'react';
import SignInRequiredDialog from '@/components/Dialogs/SignInRequired';
import CommonHeader from '@/components/Layouts/CommonHeader';
import SignInButton from '@/components/Buttons/SignIn';
import useDimensions from '@/hooks/useDimensions';

export default function LiveChatButton() {
  const theme = useTheme();
  const [liveChatState, setLiveChatState] = useState(false);
  const setActiveDialog = useSetRecoilState(selectedDialogAtom);
  const user = useRecoilValue(userAtom);
  const dimensions = useDimensions();

  const onClickHandler = () => {
    if (!user.userState) {
      setActiveDialog(<SignInRequiredDialog />);
      return;
    }
    setLiveChatState(!liveChatState);
  };

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
          height: liveChatState ? `${dimensions.height}px` : '0vh',
          width: '100vw',
          maxHeight: `min(800px, calc(${dimensions.height}px - 180px))`,
          maxWidth: `min(600px, calc(${dimensions.width}px - 48px))`,
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
