import { useSetRecoilState } from 'recoil';
import {
  selectedSupportChat,
  selectedSupportChatUserAtom,
} from '@/recoil/atoms/supportChat';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import { Comment } from '@mui/icons-material';
import { UserProfile } from '@/config';

export default function SelectChatUserButton({
  supportChatUser,
}: {
  supportChatUser: UserProfile;
}) {
  const setSelectedSupportChatUser = useSetRecoilState(
    selectedSupportChatUserAtom
  );
  const setSelectedSupportChat = useSetRecoilState(selectedSupportChat);

  const onClickHandler = () => {
    setSelectedSupportChatUser(supportChatUser);
    setSelectedSupportChat(null);
  };

  return (
    <Button sx={{ justifyContent: 'space-between' }} onClick={onClickHandler}>
      <Box>{supportChatUser.displayName ?? 'No Name'}</Box>
      <Comment />
    </Button>
  );
}
