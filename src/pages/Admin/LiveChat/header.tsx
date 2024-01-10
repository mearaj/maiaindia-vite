import { useRecoilState, useSetRecoilState } from 'recoil';
import { adminActiveChatSessionAtom } from '@/recoil/atoms/supportChat';
import {
  Box,
  Button,
  IconButton,
  Link,
  Typography,
  useTheme,
} from '@mui/material';
import { menuAtom } from '@/recoil/atoms';
import ArrowBack from '@mui/icons-material/ArrowBackIos';
import { NavLink } from 'react-router-dom';
import Close from '@mui/icons-material/Close';
import Menu from '@mui/icons-material/Menu';
import { appAbsoluteRoutes } from '@/Router';
import HeaderLayout from '@/components/Layouts/Header';
import { useChatSessionEffects } from '@/hooks/useChatSession';

export default function AdminLiveChatPageHeader() {
  const [activeLiveChatSession, setActiveLiveChatSession] = useRecoilState(
    adminActiveChatSessionAtom
  );
  const theme = useTheme();
  const setShowMenu = useSetRecoilState(menuAtom);
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
          <Link
            variant="button"
            component={NavLink}
            to={appAbsoluteRoutes.products}
            sx={{ height: '100%' }}
          >
            <Button
              sx={{
                height: '100%',
                width: 'auto',
                flexShrink: 0,
                display: 'flex',
                padding: '0px',
              }}
            >
              <Box
                src="/images/logo-yellow.png"
                component="img"
                sx={{ height: '100%', width: 'auto', padding: '8px 0px' }}
                alt="Logo"
              />
            </Button>
          </Link>
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
            <Menu
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
