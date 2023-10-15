import * as React from 'react';
import {
  Accordion,
  AccordionSummary,
  Box,
  IconButton,
  SwipeableDrawer,
  Typography,
  useTheme,
} from '@mui/material';
import Close from '@mui/icons-material/Close';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { selectShowMenu, useAppDispatch, useAppSelector } from '@/store';
import { setShowMenu } from '@/store/features/ui';
import Categories from '@/components/Categories';
import UserComponent from '@/components/User';
import logoDarkGreen from '@/assets/images/logo-dark-green.png';

export interface DrawerProps {
  className?: string;
}

export default function Drawer(_: DrawerProps) {
  const dispatch = useAppDispatch();
  const showMenu = useAppSelector(selectShowMenu);
  const theme = useTheme();

  return (
    <SwipeableDrawer
      sx={{ width: '100%' }}
      onClose={(__: React.SyntheticEvent<NonNullable<unknown>, Event>) => {
        dispatch(setShowMenu(false));
      }}
      onOpen={(__: React.SyntheticEvent<NonNullable<unknown>, Event>) => {}}
      open={showMenu}
      disableBackdropTransition
      hideBackdrop
      variant="temporary"
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: theme.dimensions.appBarHeight,
          padding: '16px',
          width: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <Box sx={{ height: '100%' }}>
            <Box
              component="img"
              src={logoDarkGreen}
              alt="logo"
              sx={{ height: '100%', width: 'auto' }}
            />
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            flexShrink: '0',
          }}
        >
          <IconButton
            onClick={() => {
              dispatch(setShowMenu(false));
            }}
          >
            <Close sx={{ fontSize: '32px' }} />
          </IconButton>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          flexGrow: '1',
          flexShrink: '0',
          padding: '16px',
        }}
      >
        <UserComponent />
        <Accordion
          expanded={false}
          onChange={(___) => null}
          onClick={() => {
            dispatch(setShowMenu(false));
            // router.replace('/admin');
          }}
          sx={{
            backgroundColor: 'transparent',
            color: 'inherit',
          }}
        >
          <AccordionSummary expandIcon={<ChevronRight />}>
            <Typography>Admin</Typography>
          </AccordionSummary>
        </Accordion>
        <Categories />
      </Box>
    </SwipeableDrawer>
  );
}
