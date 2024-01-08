import { SupportChatSession } from '@/recoil/data/supportChat';
import { useState } from 'react';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { Chat, Info } from '@mui/icons-material';
import ChatRoomComponent from '@/components/ChatTabs/ChatRoom';

export default function ChatTabsComponent({
  chatSession,
}: {
  chatSession: SupportChatSession;
}) {
  const [tabIndex, setTabIndex] = useState(0);
  return (
    <Box sx={{ height: `calc(100% - 48px)` }}>
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
        <ChatRoomComponent chatSession={chatSession} />
      ) : (
        <Box sx={{ padding: '16px' }}>Index two</Box>
      )}
    </Box>
  );
}
