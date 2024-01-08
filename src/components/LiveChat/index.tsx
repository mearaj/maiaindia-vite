import { Chat } from '@mui/icons-material';
import { alpha, Box, Card, IconButton, useTheme } from '@mui/material';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { userAtom } from '@/recoil/atoms';
import { selectedDialogAtom } from '@/recoil/atoms/dialog';
import { ReactNode } from 'react';
import { currentUserLiveChatMaximizedAtom } from '@/recoil/atoms/supportChat';
import ChatTabsComponent from '@/components/LiveChat/ChatTabs';
import SignInRequiredDialog from '@/components/Dialogs/SignInRequired';
import SignInButton from '@/components/Buttons/SignIn';
import useDimensions from '@/hooks/useDimensions';
import CommonHeader from '@/components/CommonHeader';

export default function LiveChatButton() {
  const theme = useTheme();
  const [isUIMaximized, setIsUIMaximized] = useRecoilState(
    currentUserLiveChatMaximizedAtom
  );
  const setActiveDialog = useSetRecoilState(selectedDialogAtom);
  const user = useRecoilValue(userAtom);
  const dimensions = useDimensions();
  const onClickHandler = () => {
    if (!user.userState) {
      setActiveDialog(<SignInRequiredDialog />);
      return;
    }
    setIsUIMaximized(!isUIMaximized);
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
      <Box sx={{ height: `calc(100% - ${theme.dimensions.appBarHeight}px)` }}>
        <CommonHeader
          onMinimizeClick={() => {
            setIsUIMaximized(false);
          }}
        />
        <Box sx={centerStyle}>
          <SignInButton />
        </Box>
      </Box>
    );
  } else {
    mainComponent = <ChatTabsComponent />;
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
          backgroundColor: 'transparent',
          position: 'absolute',
          transition: 'height 350ms,width 350ms',
        }}
      >
        {mainComponent}
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
