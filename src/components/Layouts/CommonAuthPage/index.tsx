import { Loader } from '@/components';
import { Box } from '@mui/material';
import { useRecoilValueLoadable } from 'recoil';
import { userAtom } from '@/recoil/atoms';
import { ReactNode } from 'react';
import CommonPageLayout, {
  CommonPageLayoutProps,
} from '@/components/Layouts/CommonPage';
import SignInButton from '@/components/Buttons/SignIn';

export interface CommonAuthPageLayoutProps extends CommonPageLayoutProps {}

export default function CommonAuthPage({
  children,
  ...otherProps
}: CommonAuthPageLayoutProps) {
  const { contents, state } = useRecoilValueLoadable(userAtom);

  let selectedComponent: ReactNode;

  if (state === 'hasError') {
    selectedComponent = <Box>{contents.toString()}</Box>;
  } else if (state === 'loading') {
    selectedComponent = <Loader />;
  } else if (!contents) {
    selectedComponent = (
      <>
        <Box>Sign In required</Box>
        <SignInButton />
      </>
    );
  } else {
    selectedComponent = children;
  }

  return (
    <CommonPageLayout {...otherProps}>{selectedComponent}</CommonPageLayout>
  );
}
