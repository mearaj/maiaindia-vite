import { adminActiveChatSessionAtom } from '@/jotai/atoms/supportChat';
import { Box, Button, IconButton, Typography, useTheme } from '@mui/material';
import { menuAtom } from '@/jotai/atoms';
import ArrowBack from '@mui/icons-material/ArrowBackIos';
import Close from '@mui/icons-material/Close';
import { WidgetsTwoTone } from '@mui/icons-material';
import { useAtom, useSetAtom } from 'jotai';
import LogoButton from '@/components/Buttons/Logo';
import HeaderLayout from '@/components/Layouts/Header';
import { useChatSessionEffects } from '@/hooks/useChatSession';

export default function AdminLiveChatPageHeader() {
  const [activeLiveChatSession, setActiveLiveChatSession] = useAtom(
    adminActiveChatSessionAtom
  );
  const theme = useTheme();
  const setShowMenu = useSetAtom(menuAtom);
  const chatSessionEffects = useChatSessionEffects({
    chatSession: activeLiveChatSession,
    setChatSession: setActiveLiveChatSession,
  });
  return (
    <HeaderLayout
      sx={{ height: `${theme.dimensions.appBarHeight}px` }}
      leftComponent={
        activeLiveChatSession ? (
          <IconButton
            sx={{
              height: '100%',
              width: 'auto',
              flexShrink: 0,
              display: 'flex',
            }}
            onClick={() => {
              setActiveLiveChatSession(null);
            }}
          >
            <ArrowBack
              style={{
                height: '100%',
                maxHeight: 'none',
                color: theme.palette.secondary.main,
                fontSize: '32px',
                flexShrink: 0,
              }}
            />
          </IconButton>
        ) : (
          <LogoButton />
        )
      }
      centerComponent={
        <Box>
          <Typography color="secondary" sx={{ fontSize: '18px' }}>
            Live Chat
          </Typography>
        </Box>
      }
      rightComponent={
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          {activeLiveChatSession && (
            <Button
              sx={{
                height: '100%',
                width: 'auto',
                flexShrink: 0,
                display: 'flex',
              }}
              onClick={() => chatSessionEffects.promptOnBackClick()}
            >
              <Close
                sx={{
                  height: '100%',
                  maxHeight: 'none',
                  color: theme.palette.secondary.main,
                  fontSize: '32px',
                  flexShrink: 0,
                }}
              />
            </Button>
          )}
          <Button
            sx={{
              height: '100%',
              width: 'auto',
              flexShrink: 0,
              display: 'flex',
            }}
            onClick={() => setShowMenu(true)}
          >
            <WidgetsTwoTone
              sx={{
                height: '100%',
                maxHeight: 'none',
                color: theme.palette.secondary.main,
                fontSize: '32px',
                flexShrink: 0,
              }}
            />
          </Button>
        </Box>
      }
    />
  );
}
