import { Box, Card, InputAdornment, TextField } from '@mui/material';
import { Header } from '@/components';
import { Attachment, Send } from '@mui/icons-material';
import { useRef, useState } from 'react';
import Button from '@mui/material/Button';
import {
  selectedSupportChatAtom,
  SupportChatMessage,
  SupportChatMessageNoID,
  supportChatsMessagesAtom,
} from '@/recoil/atoms/supportChat';
import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from 'recoil';
import { appFirestore } from '@/firebase';
import { addDoc, collection, serverTimestamp } from '@firebase/firestore';
import { userAtom } from '@/recoil/atoms';
import { userPlaceholderUrl } from '@/recoil/atoms/user';
import {
  selectedSupportChatUserSelector,
  supportChatUsersSessionsMapSelector,
} from '@/recoil/selectors/supportChat';
import SelectChatUserComponent from '@/components/Admin/SelectChatUser';
import RecoilLoadablePageLayout from '@/components/Layouts/RecoilLoadablePage';

export default function AdminLiveChatPage() {
  const [textValue, setTextValue] = useState('');
  const ref = useRef<HTMLElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const activeSupportChatUser = useRecoilValue(selectedSupportChatUserSelector);
  const appUser = useRecoilValue(userAtom);
  const supportChatUsersMapLoadable = useRecoilValueLoadable(
    supportChatUsersSessionsMapSelector
  );
  const [activeSupportChat, setActiveSupportChat] = useRecoilState(
    selectedSupportChatAtom
  );
  const supportChatMessages = useRecoilValue(supportChatsMessagesAtom);
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
    if (activeSupportChat) {
      const collectionRef = collection(
        appFirestore,
        'supportChats',
        activeSupportChat.id,
        'supportChatMessages'
      );
      const newMessage: SupportChatMessageNoID = {
        from: appUser.userState!.user!.uid,
        to: activeSupportChatUser!.uid!,
        attachments: null,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        text: textValueCurr,
      };
      await addDoc(collectionRef, newMessage);
    }
  };

  const supportChatUsersMap = supportChatUsersMapLoadable.contents;

  return (
    <RecoilLoadablePageLayout recoilLoadable={supportChatUsersMapLoadable}>
      <SelectChatUserComponent
        supportChatUsersSessionsMap={supportChatUsersMap}
      />
    </RecoilLoadablePageLayout>
  );

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
      <Header
        showBackIcon
        onBackIconClick={() => {
          setActiveSupportChat(null);
        }}
      />
      <Box
        ref={ref}
        sx={{
          display: 'flex',
          flexDirection: 'column-reverse',
          flexShrink: 1,
          flexGrow: 1,
          padding: '8px 16px',
          overflowY: 'auto',
          overflowX: 'hidden',
          wordBreak: 'break-word',
        }}
      >
        {/* <Box sx={{ marginTop: 'auto', padding: '0 8px' }}> */}
        {supportChatMessages[activeSupportChat.id] &&
          supportChatMessages[activeSupportChat.id].map((eachItem) => {
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
                    src={activeSupportChatUser.photoURL ?? userPlaceholderUrl}
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
                      appUser.userState.profile.photoURL ?? userPlaceholderUrl
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
          })}
        {/* </Box> */}
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
              </InputAdornment>
            ),
          }}
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
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
              borderRadius: '50%',
              lineHeight: 1,
            }}
          >
            <Send sx={{ fontSize: '24px' }} />
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
