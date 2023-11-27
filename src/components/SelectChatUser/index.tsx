import { Box } from '@mui/material';
import { useRecoilValue } from 'recoil';
import { supportChatUsersAtom } from '@/recoil/atoms/supportChat';
import { isAdminSelector } from '@/recoil/selectors/isAdmin';
import SelectChatUserButton from '@/components/Buttons/SelectChatUser';

export default function SelectChatUserComponent() {
  const supportChatUsers = useRecoilValue(supportChatUsersAtom);
  const isAdmin = useRecoilValue(isAdminSelector);

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
        {isAdmin ? 'Chat with customers.' : 'Chat with executives.'}
      </Box>
      {supportChatUsers.map((eachUser) => {
        return (
          <SelectChatUserButton key={eachUser.uid} supportChatUser={eachUser} />
        );
      })}
    </Box>
  );
}
