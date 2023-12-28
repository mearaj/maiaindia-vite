import { Box, Link, Typography, useTheme } from '@mui/material';
import { NavLink } from 'react-router-dom';
import createStyles from './styles';
import { appAbsoluteRoutes } from '@/Router';
import CategoriesRadio from '@/components/Categories';

export default function FooterComponent() {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <Box sx={styles.footer}>
      <Box sx={styles.container}>
        <CategoriesRadio
          radioGroupSx={styles.radioGroup}
          title={
            <Box sx={styles.contentTitle}>
              <Typography
                color="secondary"
                fontSize="large"
                fontWeight="bolder"
              >
                Categories
              </Typography>
            </Box>
          }
          labelColor="secondary"
          radioColor="secondary"
        />
      </Box>
      <Box sx={styles.container}>
        <Box sx={styles.contentTitle}>
          <Typography color="secondary" fontSize="large" fontWeight="bolder">
            Information
          </Typography>
        </Box>
        <Box sx={styles.content}>
          <Link
            component={NavLink}
            to={appAbsoluteRoutes.privacyPolicy}
            color="secondary"
            fontSize="small"
          >
            Privacy Policy
          </Link>
          <Link
            component={NavLink}
            to={appAbsoluteRoutes.cancellationRefundPolicies}
            color="secondary"
            fontSize="small"
          >
            Cancellation & Refund Policy
          </Link>
          <Link
            component={NavLink}
            to={appAbsoluteRoutes.cancellationRefundPolicies}
            color="secondary"
            fontSize="small"
          >
            Terms & Conditions
          </Link>
        </Box>
      </Box>
      <Box sx={styles.container}>
        <Box sx={styles.contentTitle}>
          <Typography color="secondary" fontSize="large" fontWeight="bold">
            Contact Us
          </Typography>
        </Box>
        <Box sx={styles.content}>
          <Link
            component={NavLink}
            to={appAbsoluteRoutes.contactUs}
            color="secondary"
            fontSize="small"
          >
            WhatsApp / Live Chat
          </Link>
          <Link
            component={NavLink}
            to="tel:+91-9173169661"
            color="secondary"
            fontSize="small"
          >
            Mobile: +91-9173169661
          </Link>
          <Link
            component={NavLink}
            to="mailto:proud@maiaindia.com"
            color="secondary"
            fontSize="small"
          >
            Email: proud@maiaindia.com
          </Link>
        </Box>
      </Box>
      <Box style={styles.container}>
        <Typography color="secondary" fontSize="large" fontWeight="bold">
          Our Location
        </Typography>
        <address>
          10/1529, Kanchan Villa, Oswal Street, Near Shubhash Chowk, Gopipura,
          Surat, Gujarat, India 395001.
        </address>
      </Box>
      <Box style={{ ...styles.container, marginBottom: '8px' }}>
        <Typography color="secondary" fontSize="small" fontWeight="bolder">
          &copy; 2024 Maia Jewellery | Powered by PhonePay
        </Typography>
      </Box>
    </Box>
  );
}
