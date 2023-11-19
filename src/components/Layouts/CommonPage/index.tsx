import { Header } from '@/components';
import { Box, SxProps, Theme, useTheme } from '@mui/material';
import { PropsWithChildren } from 'react';
import createStyles from '@/components/Layouts/CommonPageLayout/styles';

interface CommonPageLayoutProps extends PropsWithChildren {
  sxBodyProps?: SxProps<Theme>;
}

export default function CommonPageLayout({
  children,
  sxBodyProps = {},
}: CommonPageLayoutProps) {
  const theme = useTheme();

  const styles = createStyles(theme);

  return (
    <Box sx={styles.root}>
      <Header />
      <Box sx={{ ...styles.body, ...sxBodyProps } as SxProps<Theme>}>
        {children}
      </Box>
    </Box>
  );
}
