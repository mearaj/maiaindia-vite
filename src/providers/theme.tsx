import { alpha, createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { PropsWithChildren } from 'react';

declare module '@mui/material/styles' {
  interface Theme {
    dimensions: {
      appBarHeight: number;
      chatButtonHeight: number;
    };
  }

  interface ThemeOptions {
    dimensions: {
      appBarHeight: number;
      chatButtonHeight: number;
    };
  }
}

export default function AppThemeProvider({ children }: PropsWithChildren) {
  const primary = {
    light: '#437D53',
    main: '#155D28',
    dark: '#001900',
  };
  const secondary = {
    light: '#D6D23D',
    main: '#CCC70D',
    dark: '#8E8B09',
  };
  const AppTheme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        ...primary,
        contrastText: secondary.main,
      },
      secondary: {
        ...secondary,
        contrastText: primary.main,
      },
      text: {
        primary: primary.dark,
        secondary: alpha(primary.dark, 0.6),
        disabled: alpha(primary.dark, 0.38),
      },
      divider: alpha(primary.main, 0.16),
    },
    typography: {
      fontFamily: 'Roboto',
      allVariants: {
        color: primary.dark,
      },
    },
    dimensions: {
      appBarHeight: 60,
      chatButtonHeight: 56,
    },
  });
  return (
    <ThemeProvider theme={AppTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
