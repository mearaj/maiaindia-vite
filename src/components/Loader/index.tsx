import CircularProgress from '@mui/material/CircularProgress';
import { Box, SxProps, Theme } from '@mui/material';
import { Header } from '@/components';

interface LoaderContainerProps {
  loaderParentSx?: SxProps<Theme>;
  showHeader?: boolean;
  showBackIcon?: boolean;
  // rootSx only applies if showHeader is true
  rootSx?: SxProps<Theme>;
}

function Loader({
  loaderParentSx,
  showHeader = false,
  rootSx,
  showBackIcon = false,
}: LoaderContainerProps) {
  if (showHeader) {
    return (
      <Box
        sx={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          ...rootSx,
        }}
      >
        <Header showBackIcon={showBackIcon} />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            flexGrow: 1,
            flexShrink: 0,
            ...loaderParentSx,
          }}
        >
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        ...loaderParentSx,
      }}
    >
      <CircularProgress />
    </Box>
  );
}

export default Loader;
