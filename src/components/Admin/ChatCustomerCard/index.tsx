import { Box, Card } from '@mui/material';
import { userPlaceholderSvgUrl } from '@/recoil/data/user';
import { SupportChatSession } from '@/recoil/data/supportChat';
import { useSetRecoilState } from 'recoil';
import { adminActiveChatSessionAtom } from '@/recoil/atoms/supportChat';

export default function ChatCustomerCardComponent({
  chatSession,
}: {
  chatSession: SupportChatSession;
}) {
  const setActiveChatSession = useSetRecoilState(adminActiveChatSessionAtom);
  const handleCardClick = () => {
    setActiveChatSession(chatSession);
  };

  return (
    <Card
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
                chatSession.customerProfile?.photoURL ?? userPlaceholderSvgUrl
              }
              height="100%"
              width="100%"
              alt="executive profile"
            />
          </Box>
          <Box>
            <Box>{chatSession.customerProfile?.displayName ?? 'N/A'}</Box>
            <Box>{chatSession.customerProfile?.email ?? 'N/A'}</Box>
            <Box sx={{ marginBottom: '16px' }}>
              {chatSession.messages &&
                chatSession.messages.length > 0 &&
                chatSession.messages[chatSession.messages.length - 1].text}
            </Box>
          </Box>
        </Box>
      </Box>
    </Card>
  );
}
