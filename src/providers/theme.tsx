import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { PropsWithChildren } from 'react';

declare module '@mui/material/styles' {
  interface Palette {}

  interface PaletteOptions {}
}

export default function AppThemeProvider({ children }: PropsWithChildren) {
  const AppTheme = createTheme({
    palette: {
      primary: {
        main: '#001900',
      },
    },
  });
  return (
    <ThemeProvider theme={AppTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
