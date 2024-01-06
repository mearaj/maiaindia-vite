import { Dialog, DialogActions, DialogTitle } from '@mui/material';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userAtom } from '@/recoil/atoms';
import React from 'react';
import { selectedDialogAtom } from '@/recoil/atoms/dialog';
import { authStateEnumToString } from '@/recoil/data/auth';
import SignInButton from '@/components/Buttons/SignIn';

export default function SignInRequiredDialog() {
  const { userState, authState } = useRecoilValue(userAtom);
  const [dialog, setActiveDialog] = useRecoilState(selectedDialogAtom);

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
