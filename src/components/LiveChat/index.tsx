import { Chat } from '@mui/icons-material';
import { alpha, Box, Card, IconButton, useTheme } from '@mui/material';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { userAtom } from '@/recoil/atoms';
import { selectedDialogAtom } from '@/recoil/atoms/dialog';
import { ReactNode } from 'react';
import { currentUserLiveChatMaximizedAtom } from '@/recoil/atoms/supportChat';
import { useLocation } from 'react-router-dom';
import ChatTabsComponent from '@/components/LiveChat/ChatTabs';
import SignInRequiredDialog from '@/components/Dialogs/SignInRequired';
import SignInButton from '@/components/Buttons/SignIn';
import useDimensions from '@/hooks/useDimensions';
import CommonHeader from '@/components/CommonHeader';
import { appAbsoluteRoutes } from '@/Router';

export default function LiveChatButton() {
  const theme = useTheme();
  const [isUIMaximized, setIsUIMaximized] = useRecoilState(
    currentUserLiveChatMaximizedAtom
  );
  const location = useLocation();
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
          height: `${dimensions.height}px`,
          width: '100vw',
          maxHeight: `min(800px, calc(${dimensions.height}px - 140px))`,
          maxWidth: `min(600px, calc(${dimensions.width}px - 48px))`,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'transparent',
          position: 'absolute',
          visibility: isUIMaximized ? 'visible' : 'hidden',
          opacity: isUIMaximized ? 1 : 0,
          transition: 'visibility 250ms,opacity 250ms',
        }}
      >
        {mainComponent}
      </Card>
      <IconButton
        color="secondary"
        onClick={onClickHandler}
        sx={{
          padding: '12px',
          height: `${theme.dimensions.chatButtonHeight}px`,
          width: `${theme.dimensions.chatButtonHeight}px`,
          display:
            location.pathname !== appAbsoluteRoutes.adminLiveChat
              ? 'inline-flex'
              : 'none',
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
