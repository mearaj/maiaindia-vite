import {
  Box,
  Card,
  Dialog,
  DialogContent,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { Attachment, Send } from '@mui/icons-material';
import { useEffect, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import {
  currentUserLastActiveChatSessionAtom,
  currentUserLastActiveChatSessionMessagesAtom,
} from '@/recoil/atoms/supportChat';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { userAtom } from '@/recoil/atoms';
import { userPlaceholderSvgUrl } from '@/recoil/data/user';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from '@firebase/firestore';
import { appFirestore, updateDocsSnapshots } from '@/firebase';
import {
  SupportChatMessage,
  SupportChatMessageNoID,
  SupportChatSession,
} from '@/recoil/data/supportChat';
import { selectedDialogAtom } from '@/recoil/atoms/dialog';
import CircularProgress from '@mui/material/CircularProgress';
import { FirebaseError } from '@firebase/util';
import SnackbarDialog from '@/components/Dialogs/SnackBar';

export default function ChatRoomComponent() {
  const [textValue, setTextValue] = useState('');
  const ref = useRef<HTMLElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const appUser = useRecoilValue(userAtom);
  const [chatSession, setChatSession] = useRecoilState(
    currentUserLastActiveChatSessionAtom
  );
  const [supportChatMessages, setSupportChatMessages] = useRecoilState(
    currentUserLastActiveChatSessionMessagesAtom
  );
  const setDialog = useSetRecoilState(selectedDialogAtom);
  const theme = useTheme();

  useEffect(() => {
    let subscription = () => {};
    if (chatSession && chatSession.id) {
      const messagesCollectionRef = collection(
        appFirestore,
        'supportChats',
        chatSession!.id!,
        'supportChatMessages'
      );
      const queryRef = query(
        messagesCollectionRef,
        orderBy('createdAt', 'desc')
      );
      getDocs(queryRef).then((docs) => {
        let previousMessages = docs.docs as unknown as SupportChatMessage[];
        subscription = onSnapshot(queryRef, (messagesSnapshot) => {
          if (messagesSnapshot.metadata.hasPendingWrites) {
            return;
          }
          previousMessages = updateDocsSnapshots(
            messagesSnapshot,
            previousMessages
          ) as SupportChatMessage[];
          setSupportChatMessages([...previousMessages]);
        });
      });
    }
    return () => {
      subscription();
    };
  }, [chatSession, setSupportChatMessages]);

  const createNewChatSession = async (): Promise<SupportChatSession | null> => {
    const open = true;
    let currentChatSession: SupportChatSession | null = null;
    setDialog(
      <Dialog open={open}>
        <DialogContent>
          <Box>Creating new chat session please wait!.</Box>
          <CircularProgress />
        </DialogContent>
      </Dialog>
    );
    const collectionRef = collection(appFirestore, 'supportChats');
    let errStr: string | null = null;
    try {
      const chatSessionIDRef = await addDoc(collectionRef, {
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        status: 'open',
        customerID: appUser.userState?.user.uid,
        executiveID: null,
      } as SupportChatSession);
      const newChatSessionDoc = await getDoc(
        doc(collectionRef, chatSessionIDRef.id)
      );
      currentChatSession = {
        ...(newChatSessionDoc.data() as SupportChatSession),
        id: newChatSessionDoc.id,
      };
      setChatSession(currentChatSession);
      setSupportChatMessages([]);
    } catch (e) {
      if (e instanceof FirebaseError) {
        errStr = e.message;
      } else {
        errStr = (e as any).toString();
      }
    }
    if (errStr != null) {
      setDialog(<SnackbarDialog severity="error" message={errStr} />);
    } else {
      setDialog(
        <SnackbarDialog
          severity="success"
          message="Successfully created new chat session!"
        />
      );
    }
    return currentChatSession;
  };
  const handleSubmit = async () => {
    const textValueCurr = textValue.trim();
    if (textValueCurr.length === 0) {
      return;
    }
    setTextValue('');
    setTimeout(() => {
      if (ref && ref.current) {
        ref.current.scrollTop = ref.current.scrollHeight;
      }
    });
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
    let currentChatSession = chatSession;
    if (currentChatSession == null) {
      currentChatSession = await createNewChatSession();
      if (currentChatSession == null) {
        return;
      }
    }

    const collectionRef = collection(
      appFirestore,
      'supportChats',
      currentChatSession.id!,
      'supportChatMessages'
    );
    const newMessage: SupportChatMessageNoID = {
      from: appUser.userState!.user!.uid,
      to: currentChatSession!.executiveID ?? null,
      attachments: null,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
      text: textValueCurr,
    };
    await addDoc(collectionRef, newMessage);
  };

  const isMe = (supportChatMsg: SupportChatMessage) =>
    appUser &&
    appUser.userState &&
    appUser.userState.user.uid === supportChatMsg.from;

  const myCardStyle = {
    maxWidth: '70%',
    backgroundColor: `white`,
    padding: '8px 16px',
    margin: '10px 0',
    borderRadius: '10px',
    borderTopLeftRadius: '0',
    borderTopRightRadius: '0',
    position: 'relative',
    overflow: 'visible',
    whiteSpace: 'pre-wrap',
    '&::after': {
      content: '""',
      position: 'absolute',
      width: 0,
      height: 0,
      opacity: '1',
      borderBottom: `15px solid white`,
      borderLeft: '15px solid transparent',
      top: '0px',
      right: '-14px',
      rotate: '180deg',
    },
  };
  const youTriangleStyle = {
    maxWidth: '70%',
    backgroundColor: `white`,
    padding: '8px 16px',
    margin: '10px 0',
    borderRadius: '10px',
    borderTopLeftRadius: '0',
    borderTopRightRadius: '0',
    position: 'relative',
    overflow: 'visible',
    whiteSpace: 'pre-wrap',
    '&::after': {
      content: '""',
      position: 'absolute',
      width: 0,
      height: 0,
      opacity: '1',
      borderBottom: `15px solid white`,
      borderLeft: '15px solid transparent',
      top: '0px',
      left: '-14px',
      rotate: '-90deg',
    },
  };

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#E3F1E3',
      }}
    >
      <Box
        ref={ref}
        sx={{
          display: 'flex',
          flexDirection:
            supportChatMessages && supportChatMessages.length > 0
              ? 'column-reverse'
              : 'column',
          flexShrink: 1,
          flexGrow: 1,
          padding: '8px 16px',
          overflowY: 'auto',
          overflowX: 'hidden',
          wordBreak: 'break-word',
        }}
      >
        {supportChatMessages && supportChatMessages.length > 0 ? (
          supportChatMessages.map((eachItem) => {
            const isMyMessage = isMe(eachItem);
            return (
              <Box
                key={eachItem.id}
                sx={{
                  display: 'flex',
                  width: '100%',
                  justifyContent: isMyMessage ? 'flex-end' : 'flex-start',
                }}
              >
                {!isMyMessage && (
                  <img
                    src={userPlaceholderSvgUrl}
                    alt="profile"
                    style={{
                      height: '32px',
                      width: '32px',
                      borderRadius: '50%',
                      marginTop: '18px',
                      marginRight: '12px',
                    }}
                  />
                )}
                <Card sx={isMyMessage ? myCardStyle : youTriangleStyle}>
                  {eachItem.text}
                </Card>
                {isMyMessage && appUser.userState && (
                  <img
                    src={
                      appUser.userState.profile.photoURL ??
                      userPlaceholderSvgUrl
                    }
                    alt="profile"
                    style={{
                      height: '32px',
                      width: '32px',
                      borderRadius: '50%',
                      marginTop: '18px',
                      marginLeft: '12px',
                    }}
                  />
                )}
              </Box>
            );
          })
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '16px',
            }}
          >
            <Box sx={{ height: '80px', marginBottom: '16px' }}>
              <img src={userPlaceholderSvgUrl} alt="Executive" height="100%" />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}
              >
                Hi,
              </Typography>
              <Typography sx={{ marginBottom: '8px' }}>
                We are glad to assist you.
              </Typography>
              <Typography sx={{ marginBottom: '8px' }}>
                At any time, on the top right tab section you can view our
                presence status and other details.
              </Typography>
              <Typography sx={{ marginBottom: '8px' }}>
                In case of our executives unavailability, you can still message
                us and our executive will attend you or respond to your query.
              </Typography>
              <Typography sx={{ marginBottom: '8px' }}>
                To end the chat session, you may click close icon on the top
                right. Please be careful, ending chat session indicates your
                issue is resolved. You may alternatively just minimize the
                window by clicking top right minimize icon or the main chat icon
                at bottom
              </Typography>
              <Typography>
                You may type your query at the bottom of this window.
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      <Box sx={{ display: 'flex', padding: '8px', alignItems: 'stretch' }}>
        <TextField
          maxRows={3}
          multiline
          fullWidth
          onChange={(e) => {
            setTextValue(e.target.value);
          }}
          value={textValue}
          inputRef={inputRef}
          placeholder="Type messages here..."
          sx={{
            '.MuiInputBase-input': {
              paddingLeft: '6px',
            },
          }}
          InputProps={{
            sx: {
              lineHeight: '1.2',
              padding: '6px',
              backgroundColor: 'white',
            },
            endAdornment: (
              <InputAdornment
                position="end"
                sx={{
                  margin: '0',
                  maxHeight: 'none',
                  height: '100%',
                  padding: '0 0',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                }}
              >
                <Tooltip
                  title={<Typography color="secondary">Coming soon</Typography>}
                  placement="left"
                  componentsProps={{
                    tooltip: {
                      sx: {
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.secondary.main,
                      },
                    },
                  }}
                >
                  <Button
                    color="inherit"
                    sx={{
                      minWidth: '0',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0px',
                    }}
                  >
                    <Attachment />
                  </Button>
                </Tooltip>
              </InputAdornment>
            ),
          }}
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minWidth: '0',
            padding: '0 6px',
          }}
        >
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              padding: '6px',
              minWidth: '0',
              minHeight: '0',
              lineHeight: 1,
              borderRadius: '50%',
            }}
          >
            <Send sx={{ fontSize: '24px' }} />
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
