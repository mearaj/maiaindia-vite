import { Box, Button, Link, useTheme } from '@mui/material';
import WhatsApp from '@mui/icons-material/WhatsApp';
import { NavLink } from 'react-router-dom';
import { Message } from '@mui/icons-material';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userAtom } from '@/recoil/atoms';
import { selectedDialogAtom } from '@/recoil/atoms/dialog';
import createStyles from '@/pages/ContactUs/styles';
import { appAbsoluteRoutes } from '@/Router';
import CommonPageLayout from '@/components/Layouts/CommonPage';
import SignInRequiredDialog from '@/components/Dialogs/SignInRequired';

export default function ContactUsPage() {
  const theme = useTheme();
  const { userState } = useRecoilValue(userAtom);
  const setSelectedDialog = useSetRecoilState(selectedDialogAtom);

  const styles = createStyles(theme);

  const handleLiveChatClick = () => {
    if (!userState) {
      setSelectedDialog(<SignInRequiredDialog />);
    }
  };

  return (
    <CommonPageLayout showHeader>
      <Box sx={{ padding: '16px' }}>
        <Link
          component={NavLink}
          to="https://api.whatsapp.com/send?phone=+919173169661&text=Hi"
        >
          <Button
            startIcon={<WhatsApp />}
            variant="outlined"
            sx={styles.whatsAppButton}
            size="large"
          >
            Click for Whats App Chat
          </Button>
        </Link>
        <Box
          sx={{ textAlign: 'center', margin: '8px auto', fontWeight: 'bold' }}
        >
          OR
        </Box>
        <Link
          component={NavLink}
          to={!userState ? '#' : appAbsoluteRoutes.liveChat}
        >
          <Button
            fullWidth
            variant="outlined"
            size="large"
            startIcon={<Message />}
            onClick={handleLiveChatClick}
          >
            Live Chat
          </Button>
        </Link>
      </Box>
    </CommonPageLayout>
  );
}
