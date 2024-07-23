import { Box, Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import React from 'react';
import { selectedDialogAtom } from '@/jotai/atoms/dialog';
import { useAtom } from 'jotai/index';
import Close from '@mui/icons-material/Close';
import RingSizesTable from '@/components/Ring/RingSizesTable';

export default function RingSizesDialog() {
  const [dialog, setActiveDialog] = useAtom(selectedDialogAtom);

  const handleClose = (_e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setActiveDialog(null);
  };

  return (
    <Dialog open={dialog !== null} onClose={handleClose}>
      <DialogTitle
        sx={{
          textAlign: 'center',
          justifyContent: 'space-between',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Box>Indian Ring Sizes</Box>
        <Button
          onClick={() => setActiveDialog(null)}
          sx={{ margin: '0px', padding: '0px', minWidth: '0px' }}
        >
          <Close />
        </Button>
      </DialogTitle>
      <DialogContent>
        <RingSizesTable />
      </DialogContent>
    </Dialog>
  );
}
