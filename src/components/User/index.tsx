import { userAtom } from '@/jotai/atoms';
import { Box } from '@mui/material';
import { useAtomValue } from 'jotai/index';
import SignOutButton from '@/components/Buttons/SignOut';
import SignInButton from '@/components/Buttons/SignIn';

export default function UserComponent() {
  const { userState } = useAtomValue(userAtom);

  return userState ? (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Box
        component="img"
        src={userState.profile.photoURL ?? '/images/placeholder.svg'}
        alt="user"
        sx={{ width: '60px', borderRadius: '50%', marginRight: '16px' }}
      />
      <Box>
        <Box>{userState.profile.displayName}</Box>
        <SignOutButton />
      </Box>
    </Box>
  ) : (
    <Box
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <SignInButton />
    </Box>
  );
}
