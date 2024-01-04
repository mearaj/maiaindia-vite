import { useSetRecoilState } from 'recoil';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import { Comment } from '@mui/icons-material';
import { selectedSupportChatUserSelector } from '@/recoil/selectors/supportChat';
import { UserProfile } from '@/recoil/data/user';

export default function SelectChatUserButton({
  supportChatUser,
}: {
  supportChatUser: UserProfile;
}) {
  const setSelectedSupportChatUser = useSetRecoilState(
    selectedSupportChatUserSelector
  );

  const onClickHandler = () => {
    setSelectedSupportChatUser(supportChatUser);
  };

  return (
    <Button sx={{ justifyContent: 'space-between' }} onClick={onClickHandler}>
      <Box>{supportChatUser.displayName ?? 'No Name'}</Box>
      <Comment />
    </Button>
  );
}
