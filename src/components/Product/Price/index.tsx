import { Box, SxProps, Theme } from '@mui/material';

export default function ProductPrice(sx?: SxProps<Theme>) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        fontSize: '12px',
        alignItems: 'center',
        ...sx,
      }}
    >
      <Box sx={{ display: 'flex' }}>
        <Box
          sx={{
            fontSize: '12px',
          }}
        >
          ₹
        </Box>
        <Box
          sx={{
            fontSize: '20px',
            fontWeight: '600',
          }}
        >
          N/A&nbsp;
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
        <Box
          sx={{
            fontSize: '12px',
            fontWeight: '300',
          }}
        >
          M.R.P.&nbsp;
        </Box>
        <Box sx={{ display: 'flex' }}>
          <Box sx={{ fontSize: '12px' }}>₹</Box>
          <Box
            sx={{
              fontSize: '12px',
              fontWeight: 300,
            }}
          >
            N/A
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
