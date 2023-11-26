import { useSetRecoilState } from 'recoil';
import {
  selectedSupportChatSessionAtom,
  selectedSupportChatUserAtom,
  SupportChatUser,
} from '@/recoil/atoms/supportChat';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import { Comment } from '@mui/icons-material';

export default function SelectChatUserButton({
  supportChatUser,
}: {
  supportChatUser: SupportChatUser;
}) {
  const setSelectedSupportChatUser = useSetRecoilState(
    selectedSupportChatUserAtom
  );
  const setSelectedActiveChatSession = useSetRecoilState(
    selectedSupportChatSessionAtom
  );

  const onClickHandler = () => {
    setSelectedSupportChatUser(supportChatUser);
    setSelectedActiveChatSession(null);
  };

  return (
    <Button sx={{ justifyContent: 'space-between' }} onClick={onClickHandler}>
      <Box>{supportChatUser.profile.displayName ?? 'No Name'}</Box>
      <Comment />
    </Button>
  );
}
