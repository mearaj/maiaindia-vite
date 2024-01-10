import { useRecoilState, useRecoilValue } from 'recoil';
import {
  adminActiveChatSessionAtom,
  adminSupportChatSessions,
} from '@/recoil/atoms/supportChat';
import { Box, useTheme } from '@mui/material';
import { useEffect } from 'react';
import { Timestamp } from '@firebase/firestore';
import ChatCustomerCardComponent from '@/components/Admin/ChatCustomerCard';
import CommonChatRoomComponent from '@/components/LiveChat/ChatTabs/CommonChatRoom';
import AdminLiveChatPageHeader from '@/pages/Admin/LiveChat/header';

export default function AdminLiveChatPage() {
  const supportChatSessions = useRecoilValue(adminSupportChatSessions);
  const [activeLiveChatSession, setActiveLiveChatSession] = useRecoilState(
    adminActiveChatSessionAtom
  );
  const theme = useTheme();

  useEffect(() => {
    const found = supportChatSessions.find(
      (eachSession) => eachSession.id === activeLiveChatSession?.id
    );
    if (!found && activeLiveChatSession != null) {
      setActiveLiveChatSession(null);
    } else if (
      found &&
      activeLiveChatSession != null &&
      !(found.updatedAt as Timestamp).isEqual(
        activeLiveChatSession.updatedAt as Timestamp
      )
    ) {
      setActiveLiveChatSession(found);
    }
  }, [activeLiveChatSession, setActiveLiveChatSession, supportChatSessions]);

  return (
    <Box sx={{ height: '100%' }}>
      <AdminLiveChatPageHeader />
      <Box
        sx={{
          height: `calc(100% - ${theme.dimensions.appBarHeight}px)`,
        }}
      >
        {supportChatSessions.length < 1 && (
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
                <ChatCustomerCardComponent chatSession={eachSession} />
              </Box>
            );
          })}
      </Box>
    </Box>
  );
}
