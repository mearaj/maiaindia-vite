import { Box, Button } from '@mui/material';
import { useContext } from 'react';
import { ProviderId } from '@firebase/auth';
import Loader from '@/components/Loader';
import { FirebaseContext } from '@/providers/firebase';
import GoogleIcon from '@/icons/google-g';

export default function UserComponent() {
  const { user, isLoading, signIn, signOut } = useContext(FirebaseContext);
  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '8px 16px',
    width: 'calc(320px - 48px)',
    margin: '8px 0',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: '18px',
  };
  const iconContainerStyle = {
    width: '32px',
    height: '32px',
    backgroundColor: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '16px',
  };

  if (isLoading) {
    return <Loader />;
  }

  if (user) {
    return (
      <Box
        sx={{
          flexShrink: '1',
          flexGrow: '0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Button
          sx={{
            ...buttonStyle,
            justifyContent: 'center',
            fontWeight: 'bold',
          }}
          onClick={signOut}
        >
          Sign Out
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexShrink: '1',
        flexGrow: '0',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Button sx={buttonStyle} onClick={async () => signIn(ProviderId.GOOGLE)}>
        <Box sx={iconContainerStyle}>
          <GoogleIcon style={{ fontSize: '24px' }} />
        </Box>
        <Box sx={{ fontWeight: 'bold', textAlign: 'left' }}>Google Sign In</Box>
      </Button>
    </Box>
  );
}
