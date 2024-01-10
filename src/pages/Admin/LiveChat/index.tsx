import { useRecoilState, useRecoilValue } from 'recoil';
import {
  adminActiveChatSessionAtom,
  adminSupportChatSessions,
} from '@/recoil/atoms/supportChat';
import { Box } from '@mui/material';
import CommonPageLayout from '@/components/Layouts/CommonPage';
import ChatCustomerCardComponent from '@/components/Admin/ChatCustomerCard';
import CommonChatRoomComponent from '@/components/LiveChat/ChatTabs/CommonChatRoom';

export default function AdminLiveChatPage() {
  const supportChatSessions = useRecoilValue(adminSupportChatSessions);
  const [activeLiveChatSession, setActiveLiveChatSession] = useRecoilState(
    adminActiveChatSessionAtom
  );
  return (
    <CommonPageLayout
      headerProps={{
        onBackIconClick:
          activeLiveChatSession != null
            ? () => {
                setActiveLiveChatSession(null);
              }
            : undefined,
        showBackIcon: activeLiveChatSession != null,
      }}
    >
      <Box sx={{ height: '100%' }}>
        {supportChatSessions.length < 1 && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            No active chat sessions.
          </Box>
        )}
        {activeLiveChatSession && (
          <CommonChatRoomComponent
            chatSession={activeLiveChatSession}
            setChatSession={setActiveLiveChatSession}
            isAdminUI
          />
        )}

        {!activeLiveChatSession &&
          supportChatSessions.map((eachSession) => {
            return (
              <Box key={eachSession.id} sx={{ margin: '16px' }}>
                <ChatCustomerCardComponent chatSession={eachSession} />
              </Box>
            );
          })}
      </Box>
    </CommonPageLayout>
  );
}
