import { Box } from '@mui/material';
import { Comment } from '@mui/icons-material';
import Button from '@mui/material/Button';
import { useSetRecoilState } from 'recoil';
import { selectedChatUserAtom } from '@/recoil/atoms/user';
import { adminUsers } from '@/config';

export default function SelectChatUserComponent() {
  const setActiveChatUser = useSetRecoilState(selectedChatUserAtom);

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
      {adminUsers.map((eachUser) => {
        return (
          <Button
            key={eachUser.uid}
            sx={{ justifyContent: 'space-between' }}
            onClick={() => {
              setActiveChatUser(eachUser);
            }}
          >
            <Box>{eachUser.displayName}</Box>
            <Comment />
          </Button>
        );
      })}
    </Box>
  );
}
