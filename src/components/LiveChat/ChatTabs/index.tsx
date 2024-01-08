import { useState } from 'react';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from '@mui/material';
import { Chat, Info } from '@mui/icons-material';
import Button from '@mui/material/Button';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { selectedDialogAtom } from '@/recoil/atoms/dialog';
import {
  currentUserLastActiveChatSessionAtom,
  currentUserLiveChatMaximizedAtom,
} from '@/recoil/atoms/supportChat';
import ChatRoomComponent from '@/components/LiveChat/ChatTabs/ChatRoom';
import CommonHeader from '@/components/Layouts/CommonHeader';

export default function ChatTabsComponent() {
  const [tabIndex, setTabIndex] = useState(0);
  const setDialog = useSetRecoilState(selectedDialogAtom);
  const chatSession = useRecoilValue(currentUserLastActiveChatSessionAtom);
  const [isUIMaximized, setIsUIMaximized] = useRecoilState(
    currentUserLiveChatMaximizedAtom
  );
  const theme = useTheme();
  return (
    <Box sx={{ height: '100%' }}>
      <CommonHeader
        onBackIconClick={
          chatSession != null
            ? async () => {
                const promptResult = await new Promise<boolean>((r) => {
                  const open = true;
                  setDialog(
                    <Dialog open={open} onClose={() => r(false)}>
                      <DialogTitle sx={{ textAlign: 'center' }}>
                        Are you sure you want to end the current chat session ?
                      </DialogTitle>
                      <DialogContent>
                        This may mark the current chat session as resolved.
                      </DialogContent>
                      <DialogActions>
                        <Button
                          onClick={() => {
                            r(false);
                          }}
                        >
                          No
                        </Button>
                        <Button onClick={() => r(true)}>Yes</Button>
                      </DialogActions>
                    </Dialog>
                  );
                });
                if (promptResult) {
                  // if there are no messages in the current session then delete this session
                  setDialog(null);
                } else {
                  setDialog(null);
                }
              }
            : undefined
        }
        onMinimizeClick={
          chatSession != null
            ? () => {
                setIsUIMaximized(!isUIMaximized);
              }
            : undefined
        }
        centerComponent={
          chatSession != null ? (
            <Box
              sx={{
                color: theme.palette.secondary.main,
                display: 'flex',
                justifyContent: 'center',
                fontSize: '18px',
              }}
            >
              Customer Support
            </Box>
          ) : undefined
        }
      />
      <Box sx={{ height: `100%` }}>
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
            <ChatRoomComponent />
          ) : (
            <Box sx={{ padding: '16px' }}>Index two</Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
