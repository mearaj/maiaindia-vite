import { Dialog, DialogActions, DialogTitle } from '@mui/material';
import { userAtom } from '@/jotai/atoms';
import React from 'react';
import { selectedDialogAtom } from '@/jotai/atoms/dialog';
import { authStateEnumToString } from '@/jotai/data/auth';
import { useAtom, useAtomValue } from 'jotai/index';
import SignInButton from '@/components/Buttons/SignIn';

export default function SignInRequiredDialog() {
  const { userState, authState } = useAtomValue(userAtom);
  const [dialog, setActiveDialog] = useAtom(selectedDialogAtom);

  const handleClose = (_e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setActiveDialog(null);
  };

  return (
    <Dialog open={!userState && dialog !== null} onClose={handleClose}>
      <DialogTitle sx={{ textAlign: 'center', paddingBottom: '0px' }}>
        {authStateEnumToString(authState) || 'Sign In required.'}
      </DialogTitle>
      <DialogActions sx={{ paddingTop: '0px' }}>
        <SignInButton sx={{ fontSize: '16px', justifyContent: 'center' }} />
      </DialogActions>
    </Dialog>
  );
}
