import { Box, Card, InputAdornment, TextField } from '@mui/material';
import { useRecoilState } from 'recoil';
import { Header } from '@/components';
import { Attachment, Send } from '@mui/icons-material';
import { useRef, useState } from 'react';
import Button from '@mui/material/Button';
import { selectedChatSession } from '@/recoil/atoms/chatSession';
import CommonPageLayout from '@/components/Layouts/CommonPage';
import SelectChatUserComponent from '@/components/SelectChatUser';

export default function LiveChatPage() {
  const [textValue, setTextValue] = useState('');
  const ref = useRef<HTMLElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [activeChatSession, setActiveChatUser] =
    useRecoilState(selectedChatSession);

  const handleSubmit = () => {
    setTextValue('');
    setTimeout(() => {
      if (ref && ref.current) {
        ref.current.scrollTop = ref.current.scrollHeight;
      }
    });
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  };

  if (!activeChatSession) {
    return (
      <CommonPageLayout
        sxBodyProps={{
          alignItems: 'start',
          justifyContent: 'start',
          flexGrow: 0,
        }}
      >
        <SelectChatUserComponent />
      </CommonPageLayout>
    );
  }

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#E3F1E3',
      }}
    >
      <Header
        showBackIcon
        onBackIconClick={() => {
          setActiveChatUser(null);
        }}
      />
      <Box
        ref={ref}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 1,
          flexGrow: 1,
          padding: '8px 16px',
          overflowY: 'auto',
          overflowX: 'hidden',
          wordBreak: 'break-word',
        }}
      >
        <Box sx={{ marginTop: 'auto', padding: '0 8px' }}>
          {[].map((eachItem) => (
            <Card
              sx={{
                maxWidth: '50%',
                backgroundColor: `white`,
                padding: '8px 16px',
                margin: '10px 0',
                borderRadius: '10px',
                borderTopLeftRadius: '0',
                borderTopRightRadius: '0',
                position: 'relative',
                overflow: 'visible',
                marginLeft: 'auto',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  width: 0,
                  height: 0,
                  opacity: '1',
                  borderBottom: `15px solid white`,
                  borderLeft: '15px solid transparent',
                  top: '0px',
                  right: '-14px',
                  rotate: '180deg',
                },
              }}
              key={eachItem}
            >
              {eachItem}
            </Card>
          ))}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', padding: '8px', alignItems: 'stretch' }}>
        <TextField
          maxRows={3}
          multiline
          fullWidth
          onChange={(e) => {
            setTextValue(e.target.value);
          }}
          value={textValue}
          inputRef={inputRef}
          sx={{
            '.MuiInputBase-input': {
              paddingLeft: '6px',
            },
          }}
          InputProps={{
            sx: {
              lineHeight: '1.2',
              padding: '6px',
              backgroundColor: 'white',
            },
            endAdornment: (
              <InputAdornment
                position="end"
                sx={{
                  margin: '0',
                  maxHeight: 'none',
                  height: '100%',
                  padding: '0 0',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                }}
              >
                <Button
                  color="inherit"
                  sx={{
                    minWidth: '0',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0px',
                  }}
                >
                  <Attachment />
                </Button>
              </InputAdornment>
            ),
          }}
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'center',
            minWidth: '0',
            padding: '0 6px',
          }}
        >
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              padding: '6px',
              minWidth: '0',
              minHeight: '0',
              borderRadius: '50%',
              lineHeight: 1,
            }}
          >
            <Send sx={{ fontSize: '24px' }} />
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
