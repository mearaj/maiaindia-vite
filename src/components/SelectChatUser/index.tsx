import { Box } from '@mui/material';
import { Comment } from '@mui/icons-material';
import Button from '@mui/material/Button';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  selectedSupportChatUserAtom,
  SupportChatUser,
  supportChatUsersAtom,
} from '@/recoil/atoms/supportChat';

function ChatSessionButton({
  chatSessionsItem,
}: {
  chatSessionsItem: SupportChatUser;
}) {
  const setSelectedSupportChatUser = useSetRecoilState(
    selectedSupportChatUserAtom
  );

  const onClickHandler = () => {
    setSelectedSupportChatUser(chatSessionsItem);
  };

  return (
    <Button sx={{ justifyContent: 'space-between' }} onClick={onClickHandler}>
      <Box>{chatSessionsItem.user.displayName}</Box>
      <Comment />
    </Button>
  );
}

export default function SelectChatUserComponent() {
  const supportChatUsers = useRecoilValue(supportChatUsersAtom);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        flexGrow: 1,
        flexShrink: 1,
        height: '100%',
        width: '100%',
        padding: '12px',
      }}
    >
      <Box
        sx={{
          fontWeight: 'bold',
          fontSize: '20px',
          textAlign: 'center',
          marginBottom: '24px',
        }}
      >
        Please select executive.
      </Box>
      {Object.keys(supportChatUsers).map((eachUser) => {
        return (
          <ChatSessionButton
            key={eachUser}
            chatSessionsItem={supportChatUsers[eachUser]}
          />
        );
      })}
    </Box>
  );
}
