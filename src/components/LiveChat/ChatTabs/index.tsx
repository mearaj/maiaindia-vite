import { useState } from 'react';
import {
  alpha,
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
import CircularProgress from '@mui/material/CircularProgress';
import { deleteDoc, doc, serverTimestamp, setDoc } from '@firebase/firestore';
import { appFirestore } from '@/firebase';
import { FirebaseError } from '@firebase/util';
import { SupportChatSession } from '@/recoil/data/supportChat';
import { userAtom } from '@/recoil/atoms';
import CustomerChatRoomComponent from '@/components/LiveChat/ChatTabs/CustomerChatRoom';
import CommonHeader from '@/components/CommonHeader';
import SnackbarDialog from '@/components/Dialogs/SnackBar';
import ChatDetailsComponent from '@/components/LiveChat/ChatTabs/ChatDetails';

export default function ChatTabsComponent() {
  const [tabIndex, setTabIndex] = useState(0);
  const setDialog = useSetRecoilState(selectedDialogAtom);
  const [chatSession, setChatSession] = useRecoilState(
    currentUserLastActiveChatSessionAtom
  );
  const currentUser = useRecoilValue(userAtom);
  const [isUIMaximized, setIsUIMaximized] = useRecoilState(
    currentUserLiveChatMaximizedAtom
  );

  const deleteOrCloseCurrentSession = async () => {
    const isEmpty =
      !chatSession ||
      !chatSession.messages ||
      chatSession.messages.length === 0;
    let action: 'close' | 'delete' = 'close';
    if (isEmpty) {
      action = 'delete';
    }
    const open = true;
    let text = 'Closing current chat session';
    if (action === 'delete') {
      text = 'Deleting current chat session';
    }
    setDialog(
      <Dialog open={open}>
        <DialogContent>
          <Box>{text}</Box>
          <CircularProgress />
        </DialogContent>
      </Dialog>
    );
    let err: string | null = null;
    let message = 'Successfully deleted current chat session!';
    try {
      if (action === 'delete') {
        await deleteDoc(doc(appFirestore, 'supportChats', chatSession!.id!));
      } else {
        await setDoc(
          doc(appFirestore, 'supportChats', chatSession!.id!),
          {
            status: 'closed',
            updatedAt: serverTimestamp(),
            customerID: currentUser.userState!.user!.uid,
          } as SupportChatSession,
          { merge: true }
        );
        message = 'Successfully closed current chat session!';
      }
    } catch (e) {
      if (e instanceof FirebaseError) {
        err = e.message;
      } else if (action === 'delete') {
        err = 'Failed to delete current chat session.';
      } else {
        err = 'Failed to close current chat session.';
      }
    } finally {
      setChatSession(null);
      setIsUIMaximized(false);
    }
    if (err) {
      setDialog(<SnackbarDialog severity="error" message={err} />);
    } else {
      setDialog(<SnackbarDialog severity="success" message={message} />);
    }
  };
  const promptOnBackClick = async () => {
    if (!chatSession || !chatSession.id) {
      setIsUIMaximized(false);
      return;
    }
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
      await deleteOrCloseCurrentSession();
    } else {
      setDialog(null);
    }
  };

  const theme = useTheme();
  return (
    <Box sx={{ height: '100%' }}>
      <CommonHeader
        sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.45) }}
        onCloseClick={promptOnBackClick}
        onMinimizeClick={() => {
          setIsUIMaximized(!isUIMaximized);
        }}
        centerComponent={
          <Box
            sx={{
              color: theme.palette.secondary.main,
              display: 'flex',
              justifyContent: 'center',
              fontSize: '18px',
            }}
          >
            Live Chat
          </Box>
        }
      />
      <Box sx={{ height: `calc(100% - ${theme.dimensions.appBarHeight}px)` }}>
        <Box
          sx={{
            height: `calc(100% - 48px)`,
            backgroundColor: '#FFFFFF',
          }}
        >
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
            <CustomerChatRoomComponent />
          ) : (
            <ChatDetailsComponent />
          )}
        </Box>
      </Box>
    </Box>
  );
}
