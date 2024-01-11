import { useRecoilValue } from 'recoil';
import { userAtom } from '@/recoil/atoms';
import { Box } from '@mui/material';
import SignOutButton from '@/components/Buttons/SignOut';
import SignInButton from '@/components/Buttons/SignIn';

export default function UserComponent() {
  const { userState } = useRecoilValue(userAtom);

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
