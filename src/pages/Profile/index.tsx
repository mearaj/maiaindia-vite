import { Box, FormControl, FormLabel, OutlinedInput } from '@mui/material';
import { useRecoilValue } from 'recoil';
import { userAtom } from '@/recoil/atoms';
import Button from '@mui/material/Button';
import CommonPageLayout from '@/components/Layouts/CommonPage';

export default function ProfilePage() {
  const { userState } = useRecoilValue(userAtom);

  if (!userState) {
    return null;
  }
  const formLabelSx = {
    marginBottom: '4px',
    fontSize: '14px',
    fontWeight: 600,
  };
  const formControlStyle = {
    marginBottom: '16px',
  };

  return (
    <CommonPageLayout
      sxBodyProps={{
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        padding: '16px',
      }}
    >
      <Box
        sx={{
          fontWeight: 'bold',
          fontSize: '20px',
          textAlign: 'center',
          margin: '0px auto 16px auto',
        }}
      >
        Profile
      </Box>
      <FormControl fullWidth sx={formControlStyle}>
        <FormLabel htmlFor="displayName" sx={formLabelSx}>
          Display Name
        </FormLabel>
        <OutlinedInput
          type="text"
          id="displayName"
          fullWidth
          size="small"
          placeholder="Enter your public name"
          defaultValue={userState.profile.displayName}
        />
      </FormControl>
      <FormControl fullWidth sx={formControlStyle}>
        <FormLabel htmlFor="profilePicture" sx={formLabelSx}>
          Profile Picture
        </FormLabel>
        <Box />
      </FormControl>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          sx={{ marginRight: '16px' }}
          variant="contained"
          onClick={() => {}}
        >
          Reset
        </Button>
        <Button variant="contained" type="submit">
          Submit
        </Button>
      </Box>
    </CommonPageLayout>
  );
}
