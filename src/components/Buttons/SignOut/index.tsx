import { Button } from '@mui/material';
import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { userAtom } from '@/recoil/atoms';
import { signOut } from '@/firebase/signOut';
import Loader from '@/components/Loader';

export default function SignOutButton() {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const user = useRecoilValue(userAtom);
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

  const signOutUser = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSigningOut(true);
    await signOut();
    setIsSigningOut(false);
  };

  if (!user) {
    return null;
  }

  return (
    <Button
      sx={{
        ...buttonStyle,
        fontWeight: 'bold',
        textAlign: 'start',
        padding: '0',
        margin: '0px',
        lineHeight: '1.2',
      }}
      onClick={signOutUser}
      disabled={isSigningOut}
    >
      {isSigningOut ? <Loader loaderParentSx={{ padding: 0 }} /> : 'Sign Out'}
    </Button>
  );
}
