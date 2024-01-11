import { useState } from 'react';
import { alpha, Box, Tab, Tabs, Typography, useTheme } from '@mui/material';
import { Chat, Info } from '@mui/icons-material';
import { useRecoilState } from 'recoil';
import {
  currentUserLastActiveChatSessionAtom,
  currentUserLiveChatMaximizedAtom,
} from '@/recoil/atoms/supportChat';
import LiveChatHeader from '@/components/LiveChat/ChatHeader';
import CommonChatRoomComponent from '@/components/LiveChat/ChatTabs/CommonChatRoom';
import ChatDetailsComponent from '@/components/LiveChat/ChatTabs/ChatDetails';
import { useChatSessionEffects } from '@/hooks/useChatSession';

export default function ChatTabsComponent() {
  const [tabIndex, setTabIndex] = useState(0);
  const [chatSession, setChatSession] = useRecoilState(
    currentUserLastActiveChatSessionAtom
  );
  const [isUIMaximized, setIsUIMaximized] = useRecoilState(
    currentUserLiveChatMaximizedAtom
  );

  const chatSessionEffects = useChatSessionEffects({
    chatSession,
    setChatSession,
  });

  const theme = useTheme();
  return (
    <Box sx={{ height: '100%' }}>
      <LiveChatHeader
        sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.8) }}
        onCloseClick={chatSessionEffects.promptOnBackClick}
        onMinimizeClick={() => {
          setIsUIMaximized(!isUIMaximized);
        }}
        leftComponent={
          <Box
            sx={{
              color: theme.palette.secondary.main,
              display: 'flex',
              justifyContent: 'center',
              fontSize: '18px',
              paddingLeft: '8px',
            }}
          >
            Live Chat
          </Box>
        }
      />
      <Box sx={{ height: `calc(100% - ${theme.dimensions.appBarHeight}px)` }}>
        <Box
          sx={{
            height: `calc(100% - 48px)`,
            backgroundColor: '#FFFFFF',
          }}
        >
          <Tabs
            value={tabIndex}
            variant="fullWidth"
            onChange={(_, newIndex) => {
              setTabIndex(newIndex);
            }}
          >
            <Tab
              value={0}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Chat sx={{ marginRight: '4px' }} />
                  <Typography color="inherit">Talk</Typography>
                </Box>
              }
            />
            <Tab
              value={1}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Info sx={{ marginRight: '4px' }} />
                  <Typography color="inherit">Manage</Typography>
                </Box>
              }
            />
          </Tabs>
          {tabIndex === 0 ? (
            <CommonChatRoomComponent
              setChatSession={setChatSession}
              chatSession={chatSession}
            />
          ) : (
            <ChatDetailsComponent />
          )}
        </Box>
      </Box>
    </Box>
  );
}
