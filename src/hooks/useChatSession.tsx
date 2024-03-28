import { SupportChatSession } from '@/jotai/data/supportChat';
import { selectedDialogAtom } from '@/jotai/atoms/dialog';
import { userAtom } from '@/jotai/atoms';
import { currentUserLiveChatMaximizedAtom } from '@/jotai/atoms/supportChat';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { deleteDoc, doc, serverTimestamp, setDoc } from '@firebase/firestore';
import { appFirestore } from '@/firebase';
import { FirebaseError } from '@firebase/util';
import Button from '@mui/material/Button';
import { useAtomValue, useSetAtom } from 'jotai';
import SnackbarDialog from '@/components/Dialogs/SnackBar';

export const useChatSessionEffects = ({
  chatSession,
  setChatSession,
}: {
  chatSession: SupportChatSession | null;
  setChatSession: Function;
}) => {
  const setDialog = useSetAtom(selectedDialogAtom);
  const currentUser = useAtomValue(userAtom);
  const setIsUIMaximized = useSetAtom(currentUserLiveChatMaximizedAtom);
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
  return { promptOnBackClick };
};
