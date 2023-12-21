import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { PropsWithChildren } from 'react';

declare module '@mui/material/styles' {
  interface Theme {
    dimensions: {
      appBarHeight: number;
    };
  }

  interface ThemeOptions {
    dimensions: {
      appBarHeight: number;
    };
  }
}

export default function AppThemeProvider({ children }: PropsWithChildren) {
  const AppTheme = createTheme({
    palette: {
      primary: {
        main: '#001900',
        light: '#155D28',
      },
      secondary: {
        main: '#CCC70D',
      },
    },
    dimensions: {
      appBarHeight: 60,
    },
  });
  return (
    <ThemeProvider theme={AppTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
