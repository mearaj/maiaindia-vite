import CircularProgress from '@mui/material/CircularProgress';
import { Box, SxProps, Theme } from '@mui/material';

interface LoaderContainerProps {
  loaderParentSx?: SxProps<Theme>;
}

function Loader({ loaderParentSx }: LoaderContainerProps) {
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
