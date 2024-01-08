import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import { Comment } from '@mui/icons-material';
import { UserProfile } from '@/recoil/data/user';

export default function SelectChatUserButton({
  supportChatUser,
}: {
  supportChatUser: UserProfile;
}) {
  // const setSelectedSupportChatUser = useSetRecoilState(
  //   selectedSupportChatUserSelector
  // );

  // const onClickHandler = () => {
  //   setSelectedSupportChatUser(supportChatUser);
  // };

  return (
    <Button sx={{ justifyContent: 'space-between' }}>
      <Box>{supportChatUser.displayName ?? 'No Name'}</Box>
      <Comment />
    </Button>
  );
}
