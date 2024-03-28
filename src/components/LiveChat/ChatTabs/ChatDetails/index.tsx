import { Box } from '@mui/material';
import { useAtomValue } from 'jotai/index';
import { adminUsersAtom } from '@/jotai/atoms/admin';
import ChatExecutiveCardComponent from '@/components/ChatExecutiveCard';

export default function ChatDetailsComponent() {
  const admins = useAtomValue(adminUsersAtom);

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#E3F1E3',
        padding: '16px',
      }}
    >
      {Object.keys(admins).length < 1 ? (
        <Box>There are no admins to view</Box>
      ) : (
        admins.map((eachAdmin) => {
          return (
            <ChatExecutiveCardComponent
              key={eachAdmin.id!}
              executiveProfile={eachAdmin}
            />
          );
        })
      )}
    </Box>
  );
}
