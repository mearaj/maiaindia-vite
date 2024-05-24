import { Box } from '@mui/material';
import { userPlaceholderSvgUrl } from '@/jotai/data/user';
import { SupportChatSession } from '@/jotai/data/supportChat';
import { adminActiveChatSessionAtom } from '@/jotai/atoms/supportChat';
import { useSetAtom } from 'jotai';

export default function ChatCustomerComponent({
  chatSession,
}: {
  chatSession: SupportChatSession;
}) {
  const setActiveChatSession = useSetAtom(adminActiveChatSessionAtom);
  const handleCardClick = () => {
    setActiveChatSession(chatSession);
  };

  return (
    <Box
      sx={{
        '&:active,&:hover': {
          boxShadow: 24,
        },
      }}
      onClick={handleCardClick}
    >
      <Box sx={{ padding: '16px' }}>
        <Box sx={{ display: 'flex' }}>
          <Box
            sx={{
              height: '50px',
              width: '50px',
              borderRadius: '50%',
              marginRight: '8px',
              flexShrink: 0,
            }}
          >
            <img
              src={
                chatSession.customer?.profile?.photoURL ?? userPlaceholderSvgUrl
              }
              height="100%"
              width="100%"
              alt="executive profile"
            />
          </Box>
          <Box>
            <Box>{chatSession.customer?.profile?.displayName ?? 'N/A'}</Box>
            <Box>{chatSession.customer?.profile?.email ?? 'N/A'}</Box>
            <Box sx={{ marginBottom: '16px' }}>
              {chatSession.messages &&
                chatSession.messages.length > 0 &&
                chatSession.messages[chatSession.messages.length - 1].text}
            </Box>
            <Box>Last seen at&nbsp;</Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
