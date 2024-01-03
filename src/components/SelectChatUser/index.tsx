import { Box } from '@mui/material';
import { useRecoilValue } from 'recoil';
import { supportChatUsersAtom } from '@/recoil/atoms/supportChat';
import SelectChatUserButton from '@/components/Buttons/SelectChatUser';

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
        Chat with customers.
      </Box>
      {supportChatUsers.map((eachUser) => {
        return (
          <SelectChatUserButton key={eachUser.uid} supportChatUser={eachUser} />
        );
      })}
    </Box>
  );
}
