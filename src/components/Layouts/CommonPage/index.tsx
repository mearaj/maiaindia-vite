import { Header } from '@/components';
import { Box, SxProps, Theme, useTheme } from '@mui/material';
import { PropsWithChildren } from 'react';
import createStyles from '@/components/Layouts/CommonPage/styles';
import { HeaderProps } from '@/components/Header';

export interface CommonPageLayoutProps extends PropsWithChildren {
  sxRootProps?: SxProps<Theme>;
  sxBodyProps?: SxProps<Theme>;
  headerProps?: HeaderProps;
  showHeader?: boolean;
}

export default function CommonPageLayout({
  children,
  sxBodyProps = {},
  headerProps = {},
  showHeader = true,
  sxRootProps = {},
}: CommonPageLayoutProps) {
  const theme = useTheme();

  const styles = createStyles(theme);
  const rootStyles = { ...styles.root, ...sxRootProps };
  const bodyStyles = { ...styles.body, ...sxBodyProps };

  return (
    <Box sx={rootStyles}>
      {showHeader && <Header {...headerProps} />}
      <Box sx={bodyStyles}>{children}</Box>
    </Box>
  );
}
