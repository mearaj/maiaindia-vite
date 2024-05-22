import { Box, IconButton, SxProps, Theme, useTheme } from '@mui/material';
import { MouseEventHandler, ReactNode } from 'react';
import Close from '@mui/icons-material/Close';
import { Minimize } from '@mui/icons-material';
import createStyles from '@/components/LiveChat/Chat/ChatHeader/styles';

export interface CommonHeaderProps {
  onCloseClick?: MouseEventHandler;
  onMinimizeClick?: MouseEventHandler;
  leftComponent?: ReactNode;
  sx?: SxProps<Theme>;
}

export default function LiveChatHeader({
  onCloseClick,
  leftComponent,
  onMinimizeClick,
  sx = {},
}: CommonHeaderProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <Box sx={{ ...styles.header, ...sx }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          flexShrink: 0,
        }}
      >
        {leftComponent}
      </Box>

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
