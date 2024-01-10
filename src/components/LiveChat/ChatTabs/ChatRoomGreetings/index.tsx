import { Box, Typography } from '@mui/material';
import { userPlaceholderSvgUrl } from '@/recoil/data/user';

export default function ChatRoomGreetingsComponent() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '16px',
      }}
    >
      <Box sx={{ height: '80px', marginBottom: '16px' }}>
        <img src={userPlaceholderSvgUrl} alt="Executive" height="100%" />
      </Box>
      <Box>
        <Typography
          sx={{
            fontSize: '24px',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          Hi,
        </Typography>
        <Typography sx={{ marginBottom: '8px' }}>
          We are glad to assist you.
        </Typography>
        <Typography sx={{ marginBottom: '8px' }}>
          At any time, on the top right tab section you can view our presence
          status and other details.
        </Typography>
        <Typography sx={{ marginBottom: '8px' }}>
          In case of our executives unavailability, you can still message us and
          our executive will attend you or respond to your query.
        </Typography>
        <Typography sx={{ marginBottom: '8px' }}>
          To end the chat session, you may click close icon on the top right.
          Please be careful, ending chat session indicates your issue is
          resolved. You may alternatively just minimize the window by clicking
          top right minimize icon or the main chat icon at bottom
        </Typography>
        <Typography>
          You may type your query at the bottom of this window.
        </Typography>
      </Box>
    </Box>
  );
}
