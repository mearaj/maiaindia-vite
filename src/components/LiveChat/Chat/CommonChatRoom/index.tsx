import {
  Box,
  Card,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { Attachment, Send } from '@mui/icons-material';
import { useEffect, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import { userAtom } from '@/jotai/atoms';
import { userPlaceholderSvgUrl } from '@/jotai/data/user';
import { doc, serverTimestamp, setDoc, Timestamp } from '@firebase/firestore';
import { appFirestore } from '@/firebase';
import {
  MessageState,
  SupportChatMessage,
  SupportChatSession,
} from '@/jotai/data/supportChat';
import { useAtomValue } from 'jotai/index';
import { firestoreAutoId } from '@/misc/id';
import ChatRoomGreetingsComponent from '@/components/LiveChat/Chat/ChatRoomGreetings';

export default function UserChatRoomComponent({
  isAdminUI = false,
  chatSession,
  setChatSession,
}: {
  isAdminUI?: boolean;
  chatSession: SupportChatSession | null;
  setChatSession: Function;
}) {
  const [textValue, setTextValue] = useState('');
  const ref = useRef<HTMLElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const appUser = useAtomValue(userAtom);
  const theme = useTheme();
  const handleSubmit = async () => {
    const textValueCurr = textValue.trim();
    if (textValueCurr.length === 0) {
      return;
    }
    setTextValue('');
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
    let currentChatSession = chatSession;
    const newMessage: SupportChatMessage = {
      from: appUser.userState!.user!.uid,
      to: null,
      attachments: [],
      updatedAt: Timestamp.now(),
      createdAt: Timestamp.now(),
      text: textValueCurr,
      id: firestoreAutoId(),
      state: MessageState.Created,
    };
    let sessionID = currentChatSession?.id;
    if (!currentChatSession) {
      if (isAdminUI) {
        return;
      }
      currentChatSession = {
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        status: 'open',
        customerID: appUser.userState!.user.uid,
        createdBy: appUser.userState!.user.uid,
        messages: [],
      };
      sessionID = firestoreAutoId();
    }
    if (isAdminUI) {
      newMessage.to = currentChatSession.customerID;
    }
    const updatedChatSession = {
      ...currentChatSession,
      messages: [...currentChatSession.messages, newMessage],
      customerID: currentChatSession.customerID,
      status: 'open',
      createdAt: currentChatSession.createdAt,
      updatedAt: serverTimestamp(),
    } as SupportChatSession;
    if (isAdminUI) {
      // updatedChatSession.executiveID = appUser.userState!.user.uid;
    }
    const docRef = doc(appFirestore, 'supportChats', sessionID!);
    try {
      await setDoc(docRef, updatedChatSession);
      setChatSession(updatedChatSession);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (ref && ref.current) {
      if (
        chatSession &&
        chatSession.messages &&
        chatSession.messages.length > 0
      ) {
        ref.current?.scrollTo(0, (ref.current?.scrollHeight ?? 0) + 48);
      } else {
        ref.current?.scrollTo(0, 0);
      }
    }
  }, [chatSession]);

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
          flexDirection: 'column',
          flexShrink: 1,
          flexGrow: 1,
          padding: '8px 16px',
          overflowY: 'auto',
          overflowX: 'hidden',
          wordBreak: 'break-word',
        }}
      >
        {chatSession?.messages && chatSession?.messages.length > 0
          ? chatSession?.messages.map((eachItem, index) => {
              const isMyMessage = isMe(eachItem);
              const myImage: string | null =
                appUser.userState?.profile.photoURL ?? null;
              let yourImage: string | null = null;
              if (isAdminUI) {
                yourImage = chatSession.customer?.profile?.photoURL ?? null;
              }

              return (
                <Box
                  key={eachItem.id}
                  sx={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: isMyMessage ? 'flex-end' : 'flex-start',
                    marginTop: index === 0 ? 'auto' : 'unset',
                  }}
                >
                  {!isMyMessage && (
                    <img
                      src={yourImage ?? userPlaceholderSvgUrl}
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
                      src={myImage ?? userPlaceholderSvgUrl}
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
          : !isAdminUI && <ChatRoomGreetingsComponent />}
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
