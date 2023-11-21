import { useRecoilValue } from 'recoil';
import { AuthState, authStateAtom } from '@/recoil/atoms/authState';
import { userAtom } from '@/recoil/atoms';
import { Box } from '@mui/material';
import { Loader } from '@/components';
import { Outlet } from 'react-router-dom';
import SignInButton from '@/components/Buttons/SignIn';
import CommonPageLayout from '@/components/Layouts/CommonPage';

export default function AuthRoutes() {
  const authState = useRecoilValue(authStateAtom);
  const user = useRecoilValue(userAtom);
  let text: string | null;
  if (authState !== AuthState.idle) {
    switch (authState) {
      case AuthState.loading:
        text = 'Loading...';
        break;
      case AuthState.signingIn:
        text = 'Signing In...';
        break;
      case AuthState.signingOut:
        text = 'Signing Out...';
        break;
      case AuthState.updatingProfile:
        text = 'Updating Profile...';
        break;
      default:
        text = null;
    }
    return (
      <CommonPageLayout>
        <Box>{text}</Box>
        <Loader />
      </CommonPageLayout>
    );
  }
  if (!user) {
    return (
      <CommonPageLayout>
        <Box>Sign In required</Box>
        <SignInButton />
      </CommonPageLayout>
    );
  }
  return <Outlet />;
}
