import CircularProgress from '@mui/material/CircularProgress';
import { Box, SxProps, Theme } from '@mui/material';

interface LoaderContainerProps {
  sx?: SxProps<Theme>;
}

function Loader({ sx }: LoaderContainerProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        ...sx,
      }}
    >
      <CircularProgress />
    </Box>
  );
}

export default Loader;
