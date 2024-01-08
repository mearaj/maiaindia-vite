import { Box, IconButton, useTheme } from '@mui/material';
import { MouseEventHandler, ReactNode } from 'react';
import Close from '@mui/icons-material/Close';
import { Minimize } from '@mui/icons-material';
import ArrowBack from '@mui/icons-material/ArrowBackIos';
import createStyles from './styles';

export interface CommonHeaderProps {
  onCloseClick?: MouseEventHandler;
  onMinimizeClick?: MouseEventHandler;
  centerComponent?: ReactNode;
  onBackIconClick?: () => void;
}

export default function CommonHeader({
  onCloseClick,
  centerComponent,
  onMinimizeClick,
  onBackIconClick,
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
          flexShrink: 0,
        }}
      >
        <Box sx={{ height: '100%', flexShrink: 0, display: 'flex' }}>
          {onBackIconClick ? (
            <IconButton sx={styles.backIconButton} onClick={onBackIconClick}>
              <ArrowBack style={styles.icon} />
            </IconButton>
          ) : (
            <Box
              component="img"
              src="/images/logo-yellow.png"
              alt="logo"
              sx={{ height: '100%', width: 'auto', padding: '8px 0px' }}
            />
          )}
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
