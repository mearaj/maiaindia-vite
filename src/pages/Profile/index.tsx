import {
  Alert,
  AlertColor,
  Box,
  FormControl,
  FormLabel,
  LinearProgress,
  OutlinedInput,
  Snackbar,
  useTheme,
} from '@mui/material';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { userAtom } from '@/recoil/atoms';
import Button from '@mui/material/Button';
import { userPlaceholderUrl } from '@/recoil/atoms/user';
import * as React from 'react';
import { ReactNode, useRef, useState } from 'react';
import { Edit } from '@mui/icons-material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { selectedDialogAtom } from '@/recoil/atoms/dialog';
import { appFirebaseStorage, appFirestore } from '@/firebase';
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  UploadTask,
} from '@firebase/storage';
import { doc, getDoc, setDoc } from '@firebase/firestore';
import CommonPageLayout from '@/components/Layouts/CommonPage';
import createStyles from './styles';
import { UserProfile } from '@/config';

/*
 * This Page assumes it's inside AuthRoutes and hence user should exist
 */

enum UploadingState {
  idle,
  uploadingPhotoLocally,
  uploadingDisplayName,
  uploadingPhotoToBackend,
  updatingUserProfile,
}

interface ProcessingState {
  uploadingState: UploadingState;
  uploadProgress: number;
}

export default function ProfilePage() {
  const [appUserState, setAppUserState] = useRecoilState(userAtom);
  const { userState } = appUserState!;
  const [editMode, setEditMode] = useState(false);
  const [profileState, setProfileState] = useState(userState!.profile);
  const [processingState, setProcessingState] = useState<ProcessingState>({
    uploadingState: UploadingState.idle,
    uploadProgress: 0,
  });
  const setDialogComponent = useSetRecoilState(selectedDialogAtom);
  // uploadTask is upload photo to backend
  const uploadPhotoTask = useRef<UploadTask | null>(null);
  // uploadedFile is for photo file uploaded to browser
  const uploadedFile = useRef<File | null>(null);

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

  const revokePhotoURLResource = () => {
    if (
      profileState.photoURL &&
      profileState.photoURL !== userState!.profile.photoURL
    ) {
      URL.revokeObjectURL(profileState.photoURL);
    }
  };
  const resetUploadPhotoTask = () => {
    if (uploadPhotoTask.current != null) {
      uploadPhotoTask.current.cancel();
      uploadPhotoTask.current = null;
    }
  };

  const resetProcessingState = () => {
    setProcessingState({
      uploadingState: UploadingState.idle,
      uploadProgress: 0,
    });
  };

  const resetUploadFileTask = () => {
    uploadedFile.current = null;
  };
  const resetProfile = () => {
    revokePhotoURLResource();
    setProfileState(userState!.profile);
    resetUploadPhotoTask();
    resetUploadFileTask();
    resetProcessingState();
  };

  // Cancel calls resetProfile and sets editMode to false
  const onCancelClick = () => {
    resetProfile();
    setEditMode(false);
  };

  const shouldDisableSubmit = () => {
    return (
      (userState!.profile.displayName === profileState.displayName &&
        userState!.profile.photoURL === profileState.photoURL) ||
      processingState.uploadingState !== UploadingState.idle
    );
  };

  const setEditModeToTrue = () => {
    setEditMode(true);
  };

  const showSnackbar = (severity: AlertColor, message: string) => {
    setDialogComponent(
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open
        autoHideDuration={6000}
        onClose={() => setDialogComponent(null)}
      >
        <Alert
          onClose={() => setDialogComponent(null)}
          severity={severity}
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
    );
  };

  const handleImageUploadLocally = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { files } = event.target;
    if (files && files.length > 0) {
      revokePhotoURLResource();
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        showSnackbar('error', 'File not supported');
        return;
      }
      // file is greater than 100Kb
      if (file.size > 1024 * 100) {
        showSnackbar('error', 'File size exceeded 100Kb limit');
        return;
      }
      uploadedFile.current = file;
      setProcessingState({
        uploadingState: UploadingState.uploadingPhotoLocally,
        uploadProgress: 0,
      });
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        resetProcessingState();
        revokePhotoURLResource();
      };
      img.onerror = (_ev) => {
        resetProfile();
        showSnackbar('error', 'Failed to upload image!');
      };
      img.src = url;
      setProfileState({ ...profileState, photoURL: url });
    }
  };

  const handleSubmit = async () => {
    if (!shouldDisableSubmit()) {
      const docRef = doc(appFirestore, 'users', userState!.profile.uid);
      let currentAppUserState = appUserState;
      if (userState!.profile.displayName !== profileState.displayName) {
        setProcessingState({
          ...processingState,
          uploadingState: UploadingState.uploadingDisplayName,
        });
        try {
          await setDoc(
            docRef,
            { profile: { displayName: profileState.displayName } },
            { mergeFields: ['profile.displayName'] }
          );
          showSnackbar('success', 'Successfully updated Display Name');
          const docSnapshot = await getDoc(docRef);
          currentAppUserState = {
            ...currentAppUserState,
            userState: {
              user: userState!.user,
              profile: {
                ...(docSnapshot.data()?.profile as UserProfile),
              },
            },
          };
          setAppUserState(currentAppUserState);
        } catch (_e) {
          showSnackbar('error', 'Failed to update Display Name.');
        }
        setProcessingState({
          uploadingState: UploadingState.idle,
          uploadProgress: 0,
        });
      }
      if (uploadedFile.current !== null) {
        if (userState!.profile.photoURL !== profileState.photoURL) {
          setProcessingState({
            ...processingState,
            uploadingState: UploadingState.uploadingPhotoToBackend,
          });
          const firebaseImageRef = ref(
            appFirebaseStorage,
            `users/${profileState!.uid}/profile`
          );
          uploadPhotoTask.current = uploadBytesResumable(
            firebaseImageRef,
            uploadedFile.current,
            { contentType: uploadedFile.current.type }
          );
          uploadPhotoTask.current.on(
            'state_changed',
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setProcessingState((prevState) => ({
                ...prevState,
                uploadProgress: progress,
              }));
            },
            (err) => {
              let message = 'Failed to upload profile picture';
              switch (err.code) {
                case 'storage/canceled':
                  message = 'Failed to upload.\nOperation canceled by user!';
                  break;
                default:
                  break;
              }
              showSnackbar('error', message);
              resetProfile();
            },
            async () => {
              showSnackbar('success', 'Successfully uploaded profile picture');
              if (uploadPhotoTask.current !== null) {
                setProcessingState({
                  uploadingState: UploadingState.updatingUserProfile,
                  uploadProgress: 0,
                });
                try {
                  const newPhotoURL = await getDownloadURL(
                    uploadPhotoTask.current.snapshot.ref
                  );
                  await setDoc(
                    docRef,
                    { profile: { photoURL: newPhotoURL } },
                    { mergeFields: ['profile.photoURL'] }
                  );
                  const docSnapshot = await getDoc(docRef);
                  currentAppUserState = {
                    ...currentAppUserState,
                    userState: {
                      user: userState!.user,
                      profile: {
                        ...(docSnapshot.data()?.profile as UserProfile),
                      },
                    },
                  };
                  setAppUserState(currentAppUserState);
                  showSnackbar('success', 'Successfully updated profile');
                } catch (_e) {
                  console.log(_e);
                  showSnackbar(
                    'error',
                    'An error occurred wrong during profile update'
                  );
                }
                onCancelClick();
              }
            }
          );
        }
      }
    }
  };

  const getUploadProgressContainer = () => {
    let uploadProgressContainer: ReactNode;
    if (processingState.uploadingState !== UploadingState.idle) {
      let progressBar: ReactNode;
      let valueStr: string = '';
      let valueNum: number = 0;
      switch (processingState.uploadingState) {
        case UploadingState.uploadingDisplayName:
          progressBar = (
            <>
              <LinearProgress />
              <Box>Updating Display Name...</Box>
            </>
          );
          break;
        case UploadingState.uploadingPhotoLocally:
          progressBar = (
            <Box>
              <LinearProgress sx={{ width: '100%', marginBottom: '4px' }} />
              <Box>Uploading Profile Photo to Browser...</Box>
            </Box>
          );
          break;
        case UploadingState.updatingUserProfile:
          progressBar = (
            <Box>
              <LinearProgress sx={{ width: '100%', marginBottom: '4px' }} />
              <Box>Updating Profile...</Box>
            </Box>
          );
          break;
        case UploadingState.uploadingPhotoToBackend:
          valueNum = processingState.uploadProgress;
          valueStr = processingState.uploadProgress.toFixed(0);
          progressBar = (
            <Box>
              <LinearProgress
                variant="determinate"
                value={valueNum}
                sx={{ width: '100%', marginBottom: '4px' }}
              />
              <Box
                sx={{ textAlign: 'center' }}
              >{`Uploaded ${valueStr} % of Photo `}</Box>
            </Box>
          );
          break;
        default:
          break;
      }
      if (progressBar) {
        uploadProgressContainer = (
          <Box
            sx={{
              width: '100%',
              height: '50px',
              padding: '8px',
              backgroundColor: 'white',
              marginBottom: '16px',
            }}
          >
            {progressBar}
          </Box>
        );
      }
    }
    return uploadProgressContainer;
  };

  if (!userState) {
    return null;
  }

  return (
    <CommonPageLayout
      sxBodyProps={{
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        padding: '16px',
      }}
    >
      {getUploadProgressContainer()}
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
            height: '96px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          <Box
            component="img"
            sx={{
              height: '96px',
              width: '96px',
              marginRight: '16px',
              borderRadius: '50%',
            }}
            src={profileState?.photoURL ?? userPlaceholderUrl}
            alt={profileState?.displayName ?? 'N/A'}
            id="profilePicture"
          />
          {editMode && (
            <Button
              component="label"
              variant="outlined"
              fullWidth
              size="small"
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
              <Box
                sx={{
                  width: '100%',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                }}
              >
                Change Image
              </Box>
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
            type="submit"
            onClick={onCancelClick}
            size="small"
          >
            Cancel
          </Button>
          <Button
            sx={{ marginRight: '16px' }}
            variant="contained"
            disabled={shouldDisableSubmit()}
            onClick={resetProfile}
            size="small"
          >
            Reset
          </Button>
          <Button
            sx={{ marginRight: '16px' }}
            variant="contained"
            type="submit"
            disabled={shouldDisableSubmit()}
            onClick={handleSubmit}
          >
            Update
          </Button>
        </Box>
      )}
    </CommonPageLayout>
  );
}
