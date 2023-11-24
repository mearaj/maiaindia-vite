import { Box } from '@mui/material';
import { useRecoilValueLoadable } from 'recoil';
import { supportChatUsersSelector } from '@/recoil/selectors/supportChat';
import { Loader } from '@/components';
import SelectChatUserButton from '@/components/Buttons/SelectChatUser';

export default function SelectChatUserComponent() {
  const { contents, state } = useRecoilValueLoadable(supportChatUsersSelector);

  if (state === 'hasError') {
    return (
      <>
        <Box>An error occurred</Box>
        <Box>{contents.toString()}</Box>
      </>
    );
  }
  if (state === 'loading') {
    return (
      <>
        <Box>Loading...</Box>
        <Loader />
      </>
    );
  }

  const supportChatUsers = contents;

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
          <SelectChatUserButton
            key={eachUser}
            chatSessionsItem={supportChatUsers[eachUser]}
          />
        );
      })}
    </Box>
  );
}
