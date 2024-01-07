import { Box } from '@mui/material';
import { useRecoilValue } from 'recoil';
import { userAtom } from '@/recoil/atoms';
import SignInButton from '@/components/Buttons/SignIn';
import SignOutButton from '@/components/Buttons/SignOut';

export default function UserComponent() {
  const { userState } = useRecoilValue(userAtom);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        {userState && (
          <Box
            component="img"
            src={userState.profile.photoURL ?? '/images/placeholder.svg'}
            alt="user"
            sx={{ width: '60px', borderRadius: '50%', marginRight: '16px' }}
          />
        )}
        <Box>
          {userState && <Box>{userState.profile.displayName}</Box>}
          {userState ? <SignOutButton /> : <SignInButton />}
        </Box>
      </Box>
    </Box>
  );
}
