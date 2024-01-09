import { useRecoilValue } from 'recoil';
import { adminSupportChatSessions } from '@/recoil/atoms/supportChat';
import { Box } from '@mui/material';
import ChatCustomerCardComponent from '@/components/ChatCustomerSessionCard';
import CommonPageLayout from '@/components/Layouts/CommonPage';

export default function AdminLiveChatPage() {
  const supportChatSessions = useRecoilValue(adminSupportChatSessions);

  return (
    <CommonPageLayout>
      <Box sx={{ padding: '16px' }}>
        {supportChatSessions.length < 1 ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            No active chat sessions.
          </Box>
        ) : (
          supportChatSessions.map((eachSession) => {
            return (
              <Box key={eachSession.id} sx={{ marginBottom: '16px' }}>
                <ChatCustomerCardComponent chatSession={eachSession} />
              </Box>
            );
          })
        )}
      </Box>
    </CommonPageLayout>
  );
}
