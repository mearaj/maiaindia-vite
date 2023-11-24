import { useSetRecoilState } from 'recoil';
import {
  selectedSupportChatSessionAtom,
  selectedSupportChatUserAtom,
} from '@/recoil/atoms/supportChat';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import { Comment } from '@mui/icons-material';
import { UserProfile } from '@/config';

export default function SelectChatUserButton({
  chatSessionsItem,
}: {
  chatSessionsItem: UserProfile;
}) {
  const setSelectedSupportChatUser = useSetRecoilState(
    selectedSupportChatUserAtom
  );
  const setSelectedActiveChatSession = useSetRecoilState(
    selectedSupportChatSessionAtom
  );

  const onClickHandler = () => {
    setSelectedSupportChatUser(chatSessionsItem);
    setSelectedActiveChatSession(null);
  };

  return (
    <Button sx={{ justifyContent: 'space-between' }} onClick={onClickHandler}>
      <Box>{chatSessionsItem.displayName}</Box>
      <Comment />
    </Button>
  );
}
