import { Box } from '@mui/material';
import imagePlaceholder from '@/assets/images/placeholder.svg';
import { useRecoilValue } from 'recoil';
import { userAtom } from '@/recoil/atoms';
import SignInButton from '@/components/Buttons/SignIn';
import SignOutButton from '@/components/Buttons/SignOut';

export default function UserComponent() {
  const user = useRecoilValue(userAtom);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '32px',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        {user && (
          <Box
            component="img"
            src={user.user.photoURL ?? imagePlaceholder}
            alt="user"
            sx={{ width: '60px', borderRadius: '50%', marginRight: '16px' }}
          />
        )}
        <Box>
          {user && <Box>{user.user.displayName}</Box>}
          {user ? <SignOutButton /> : <SignInButton />}
        </Box>
      </Box>
    </Box>
  );
}
