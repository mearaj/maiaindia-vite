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
import {
  SupportChatMessage,
  SupportChatMessageNoID,
} from '@/recoil/atoms/supportChat';
import { useRecoilValue } from 'recoil';
import { userAtom } from '@/recoil/atoms';
import { userPlaceholderSvgUrl } from '@/recoil/data/user';
import { SupportChatSession } from '@/recoil/data/supportChat';
import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from '@firebase/firestore';
import { appFirestore, updateDocsSnapshots } from '@/firebase';

export default function ChatRoomComponent({
  chatSession,
}: {
  chatSession: SupportChatSession;
}) {
  const [textValue, setTextValue] = useState('');
  const ref = useRef<HTMLElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const appUser = useRecoilValue(userAtom);
  const [supportChatMessages, setSupportChatMessages] = useState<
    SupportChatMessage[]
  >([]);
  const theme = useTheme();

  useEffect(() => {
    const messagesCollectionRef = collection(
      appFirestore,
      'supportChats',
      chatSession.id!,
      'supportChatMessages'
    );
    const queryRef = query(messagesCollectionRef, orderBy('createdAt', 'desc'));
    let subscription = () => {};
    getDocs(queryRef).then((docs) => {
      if (docs.metadata.hasPendingWrites) {
        return;
      }
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
    return () => {
      subscription();
    };
  }, [chatSession]);
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
    const collectionRef = collection(
      appFirestore,
      'supportChats',
      chatSession.id!,
      'supportChatMessages'
    );
    const newMessage: SupportChatMessageNoID = {
      from: appUser.userState!.user!.uid,
      to: chatSession.executiveID ?? null,
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
                To end the chat session, you may click back icon on the top
                left. Please be careful, ending chat session indicates your
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
