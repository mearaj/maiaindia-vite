import { Alert, AlertColor, Snackbar, SnackbarProps } from '@mui/material';
import { useRecoilState } from 'recoil';
import { selectedDialogAtom } from '@/recoil/atoms/dialog';

export interface SnackbarDialogProps extends SnackbarProps {
  severity: AlertColor;
  message: string;
}

export default function SnackbarDialog({
  severity,
  message,
  ...otherProps
}: SnackbarDialogProps) {
  const [dialogComponent, setDialogComponent] =
    useRecoilState(selectedDialogAtom);
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      open={dialogComponent != null}
      autoHideDuration={6000}
      onClose={() => setDialogComponent(null)}
      {...otherProps}
    >
      <Alert
        onClose={() => setDialogComponent(null)}
        severity={severity}
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
