import { alpha, Box, useTheme } from '@mui/material';
import {
  liveChatMaximizedAtom,
  userToAdminChatSessionAtom,
} from '@/jotai/atoms/supportChat';
import { useAtom } from 'jotai';
import LiveChatHeader from '@/components/LiveChat/Chat/ChatHeader';
import UserChatRoomComponent from '@/components/LiveChat/Chat/CommonChatRoom';
import { useChatSessionEffects } from '@/hooks/useChatSession';

export default function ChatComponent() {
  const [chatSession, setChatSession] = useAtom(userToAdminChatSessionAtom);
  const [isUIMaximized, setIsUIMaximized] = useAtom(liveChatMaximizedAtom);

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
            height: `calc(100%)`,
            backgroundColor: '#FFFFFF',
          }}
        >
          <UserChatRoomComponent
            setChatSession={setChatSession}
            chatSession={chatSession}
          />
        </Box>
      </Box>
    </Box>
  );
}
