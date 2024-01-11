import { Box, SxProps, Theme, useTheme } from '@mui/material';
import { ReactNode } from 'react';
import createStyles from '@/components/LiveChat/ChatHeader/styles';

export interface HeaderLayoutProps {
  sx?: SxProps<Theme>;
  leftComponent?: ReactNode;
  centerComponent?: ReactNode;
  rightComponent?: ReactNode;
}

export default function HeaderLayout({
  sx = {},
  leftComponent,
  centerComponent,
  rightComponent,
}: HeaderLayoutProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <Box sx={{ ...styles.header, ...sx }}>
      {leftComponent && leftComponent}
      {centerComponent && centerComponent}
      {rightComponent && rightComponent}
    </Box>
  );
}
