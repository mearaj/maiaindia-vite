import {
  adminActiveChatSessionAtom,
  adminSupportChatSessionsAtom,
} from '@/jotai/atoms/supportChat';
import { Box, Divider, useTheme } from '@mui/material';
import { useAtom, useAtomValue } from 'jotai';
import ChatCustomerComponent from '@/components/Admin/ChatCustomerCard';
import CommonChatRoomComponent from '@/components/LiveChat/Chat/CommonChatRoom';
import AdminLiveChatPageHeader from '@/pages/Admin/LiveChat/header';

export default function AdminLiveChatPage() {
  const supportChatSessions = useAtomValue(adminSupportChatSessionsAtom);
  const [activeLiveChatSession, setActiveLiveChatSession] = useAtom(
    adminActiveChatSessionAtom
  );
  const theme = useTheme();

  // useEffect(() => {
  //   const found = supportChatSessions.find(
  //     (eachSession) => eachSession.id === activeLiveChatSession?.id
  //   );
  //   if (!found && activeLiveChatSession != null) {
  //     setActiveLiveChatSession(null);
  //   } else if (found && activeLiveChatSession != null) {
  //     setActiveLiveChatSession(found);
  //   }
  // }, [activeLiveChatSession, setActiveLiveChatSession, supportChatSessions]);
  return (
    <Box sx={{ height: '100%', overflowY: 'auto' }}>
      <AdminLiveChatPageHeader />
      <Box
        sx={{
          height: `calc(100% - ${theme.dimensions.appBarHeight}px)`,
        }}
      >
        {(!supportChatSessions || supportChatSessions.length < 1) && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
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
                <ChatCustomerComponent chatSession={eachSession} />
                <Divider />
              </Box>
            );
          })}
      </Box>
    </Box>
  );
}
