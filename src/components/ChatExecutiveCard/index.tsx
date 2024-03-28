import { Box, Card } from '@mui/material';
import { userPlaceholderSvgUrl, UserProfile } from '@/jotai/data/user';

export default function ChatExecutiveCardComponent({
  executiveProfile,
}: {
  executiveProfile?: UserProfile;
}) {
  return (
    <Card sx={{ padding: '8px' }}>
      <Box
        sx={{
          display: 'flex',
          marginBottom: '8px',
          alignItems: 'center',
        }}
      >
        <Box sx={{ height: '50px', width: '50px', marginRight: '8px' }}>
          <img
            src={executiveProfile?.photoURL ?? userPlaceholderSvgUrl}
            alt="Admin"
            height="100%"
            width="100%"
            style={{ borderRadius: '50%' }}
          />
        </Box>
        <Box>{executiveProfile?.displayName ?? 'N/A'}</Box>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '60px 1fr',
        }}
      >
        <Box>Status:</Box>
        <Box>Online</Box>
      </Box>
    </Card>
  );
}
