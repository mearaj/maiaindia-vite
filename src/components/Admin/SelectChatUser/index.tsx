import { Box } from '@mui/material';
import { SupportChatUsersSessionsMap } from '@/recoil/data/supportChat';
import SelectChatUserButton from '@/components/Buttons/SelectChatUser';

export default function SelectChatUserComponent({
  supportChatUsersSessionsMap,
}: {
  supportChatUsersSessionsMap: SupportChatUsersSessionsMap;
}) {
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

      {Object.keys(supportChatUsersSessionsMap).length > 0 ? (
        Object.keys(supportChatUsersSessionsMap).map((eachUser) => {
          return (
            <SelectChatUserButton
              key={eachUser}
              supportChatUser={supportChatUsersSessionsMap[eachUser].profile}
            />
          );
        })
      ) : (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          There are no user sessions
        </Box>
      )}
    </Box>
  );
}
