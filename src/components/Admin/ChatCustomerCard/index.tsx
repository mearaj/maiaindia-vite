import { Box, Card } from '@mui/material';
import { userPlaceholderSvgUrl } from '@/jotai/data/user';
import { SupportChatSession } from '@/jotai/data/supportChat';
import { adminActiveChatSessionAtom } from '@/jotai/atoms/supportChat';
import { useAtomValue, useSetAtom } from 'jotai';
import { adminOnlineStatusesAtom } from '@/jotai/atoms/admin';

export default function ChatCustomerCardComponent({
  chatSession,
}: {
  chatSession: SupportChatSession;
}) {
  const setActiveChatSession = useSetAtom(adminActiveChatSessionAtom);
  const handleCardClick = () => {
    setActiveChatSession(chatSession);
  };
  const adminOnlineStatuses = useAtomValue(adminOnlineStatusesAtom);

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
            {adminOnlineStatuses &&
              adminOnlineStatuses[`${chatSession.customerID}`] &&
              adminOnlineStatuses[`${chatSession.customerID}`].updatedAt && (
                <Box>
                  Last seen at&nbsp;
                  {adminOnlineStatuses[
                    `${chatSession!.customerID}`
                  ]!.updatedAt!.toDate().toLocaleTimeString()}
                </Box>
              )}
          </Box>
        </Box>
      </Box>
    </Card>
  );
}
