import { Box } from '@mui/material';
import imagePlaceholder from '@/assets/images/placeholder.svg';
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
        marginBottom: '32px',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        {userState && (
          <Box
            component="img"
            src={userState.user.photoURL ?? imagePlaceholder}
            alt="user"
            sx={{ width: '60px', borderRadius: '50%', marginRight: '16px' }}
          />
        )}
        <Box>
          {userState && <Box>{userState.user.displayName}</Box>}
          {userState ? <SignOutButton /> : <SignInButton />}
        </Box>
      </Box>
    </Box>
  );
}
