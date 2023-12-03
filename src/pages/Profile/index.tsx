import {
  Box,
  FormControl,
  FormLabel,
  IconButton,
  LinearProgress,
  OutlinedInput,
  useTheme,
} from '@mui/material';
import { useRecoilValue } from 'recoil';
import { userAtom } from '@/recoil/atoms';
import Button from '@mui/material/Button';
import { userPlaceholderUrl } from '@/recoil/atoms/user';
import * as React from 'react';
import { useState } from 'react';
import { Edit } from '@mui/icons-material';
import Close from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CommonPageLayout from '@/components/Layouts/CommonPage';
import createStyles from './styles';

/*
 * This Page assumes it's inside AuthRoutes and hence user should exist
 */

export default function ProfilePage() {
  const { userState } = useRecoilValue(userAtom);
  const [editMode, setEditMode] = useState(false);
  const [profileState, setProfileState] = useState(userState!.profile);
  const [uploadingImgLocally, setUploadingImgLocally] = useState(false);

  const theme = useTheme();
  const styles = createStyles(theme);
  const formLabelSx = {
    marginBottom: '4px',
    fontSize: '14px',
    fontWeight: 600,
  };

  const formControlStyle = {
    marginBottom: '16px',
  };

  const resetProfile = () => {
    setProfileState(userState!.profile);
  };

  const shouldDisableSubmit = () => {
    return (
      (userState!.profile.displayName === profileState.displayName &&
        userState!.profile.photoURL === profileState.photoURL) ||
      uploadingImgLocally
    );
  };

  const setEditModeToTrue = () => {
    setEditMode(true);
  };

  const handleImageUploadLocally = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { files } = event.target;
    if (files && files.length > 0) {
      setUploadingImgLocally(true);
      await new Promise((r) => {
        setTimeout(r, 3500);
      });
      const url = URL.createObjectURL(files[0]);
      if (
        profileState.photoURL &&
        profileState.photoURL !== userState!.profile.photoURL
      ) {
        URL.revokeObjectURL(profileState.photoURL);
      }
      const img = new Image();
      img.onload = () => {
        setUploadingImgLocally(false);
      };
      img.onerror = () => {
        setUploadingImgLocally(false);
      };
      img.src = url;
      setProfileState({ ...profileState, photoURL: url });
    }
  };

  return (
    <CommonPageLayout
      sxBodyProps={{
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        padding: '16px',
      }}
    >
      {uploadingImgLocally && (
        <Box sx={{ width: '100%' }}>
          <LinearProgress />
        </Box>
      )}
      <Box
        sx={{
          fontWeight: 'bold',
          fontSize: '20px',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
        }}
      >
        <Box sx={{ display: 'flex' }}>Profile</Box>
        {!editMode && (
          <IconButton size="small" onClick={setEditModeToTrue}>
            <Edit />
          </IconButton>
        )}
        {editMode && (
          <IconButton
            size="small"
            onClick={() => {
              resetProfile();
              setEditMode(false);
            }}
          >
            <Close />
          </IconButton>
        )}
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
          value={profileState?.displayName}
          disabled={!editMode}
          onChange={(event) =>
            setProfileState({
              ...profileState,
              displayName: event.target.value,
            })
          }
        />
      </FormControl>
      <FormControl fullWidth sx={formControlStyle}>
        <FormLabel htmlFor="profilePicture" sx={{ ...formLabelSx }}>
          Profile Picture
        </FormLabel>
        <Box
          sx={{
            height: '70px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          <Box
            component="img"
            sx={{ height: '50px', width: 'auto', marginRight: '16px' }}
            src={profileState?.photoURL ?? userPlaceholderUrl}
            alt={profileState?.displayName ?? 'N/A'}
          />
          {editMode && (
            <Button
              component="label"
              variant="outlined"
              fullWidth
              startIcon={<CloudUploadIcon />}
            >
              <Box
                component="input"
                type="file"
                hidden
                placeholder="User Profile Picture"
                sx={styles.nativeUploadInput}
                accept="image/*"
                onChange={handleImageUploadLocally}
              />
              Change Image
            </Button>
          )}
        </Box>
        <Box />
      </FormControl>
      {!editMode && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Button
            sx={{ marginRight: '16px' }}
            variant="contained"
            onClick={setEditModeToTrue}
            startIcon={<Edit />}
          >
            Edit
          </Button>
        </Box>
      )}
      {editMode && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Button
            sx={{ marginRight: '16px' }}
            variant="contained"
            disabled={shouldDisableSubmit()}
            onClick={resetProfile}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            type="submit"
            disabled={shouldDisableSubmit()}
          >
            Update
          </Button>
        </Box>
      )}
    </CommonPageLayout>
  );
}
