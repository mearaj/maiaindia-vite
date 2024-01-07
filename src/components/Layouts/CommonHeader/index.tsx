import { Box, IconButton, useTheme } from '@mui/material';
import { MouseEventHandler, ReactNode } from 'react';
import Close from '@mui/icons-material/Close';
import { Minimize } from '@mui/icons-material';
import createStyles from './styles';

export interface CommonHeaderProps {
  onCloseClick?: MouseEventHandler;
  onMinimizeClick?: MouseEventHandler;
  centerComponent?: ReactNode;
}

export default function CommonHeader({
  onCloseClick,
  centerComponent,
  onMinimizeClick,
}: CommonHeaderProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <Box sx={styles.header}>
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
            src="/images/logo-yellow.png"
            alt="logo"
            sx={{ height: '100%', width: 'auto' }}
          />
        </Box>
      </Box>
      {centerComponent}
      <Box sx={{ display: 'flex', flexShrink: 0 }}>
        {onMinimizeClick && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <IconButton onClick={onMinimizeClick}>
              <Minimize
                sx={{ fontSize: '32px', color: theme.palette.secondary.main }}
              />
            </IconButton>
          </Box>
        )}
        {onCloseClick && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              height: '100%',
              flexShrink: '0',
            }}
          >
            <IconButton onClick={onCloseClick}>
              <Close
                sx={{ fontSize: '32px', color: theme.palette.secondary.main }}
              />
            </IconButton>
          </Box>
        )}
      </Box>
    </Box>
  );
}
