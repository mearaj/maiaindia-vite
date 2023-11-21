import { Box, Button, Link, useTheme } from '@mui/material';
import WhatsApp from '@mui/icons-material/WhatsApp';
import { NavLink } from 'react-router-dom';
import { Message } from '@mui/icons-material';
import createStyles from '@/pages/ContactUs/styles';
import { appAbsoluteRoutes } from '@/Router';
import CommonPageLayout from '@/components/Layouts/CommonPage';

export default function ContactUsPage() {
  const theme = useTheme();

  const styles = createStyles(theme);

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
        <Link component={NavLink} to={appAbsoluteRoutes.liveChat}>
          <Button
            fullWidth
            variant="outlined"
            size="large"
            startIcon={<Message />}
          >
            Live Chat
          </Button>
        </Link>
      </Box>
    </CommonPageLayout>
  );
}
