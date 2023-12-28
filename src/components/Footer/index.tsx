import { alpha, Box, Divider, Link, Typography, useTheme } from '@mui/material';
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
                fontSize="medium"
                fontWeight="bolder"
                lineHeight="1.2"
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
          <Typography
            color="secondary"
            fontSize="medium"
            fontWeight="bolder"
            lineHeight="1.2"
          >
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
          <Typography
            color="secondary"
            fontSize="medium"
            fontWeight="bold"
            lineHeight="1.2"
          >
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
      <Box sx={styles.container}>
        <Box sx={styles.contentTitle}>
          <Typography
            color="secondary"
            fontSize="medium"
            fontWeight="bold"
            lineHeight="1.2"
          >
            About Us
          </Typography>
        </Box>
        <Box sx={styles.content}>
          <Link
            component={NavLink}
            to={appAbsoluteRoutes.aboutUs}
            color="secondary"
            fontSize="small"
          >
            About Maia Jewellery
          </Link>
        </Box>
      </Box>
      <Box style={styles.container}>
        <Box style={styles.contentTitle}>
          <Typography
            color="secondary"
            fontSize="medium"
            fontWeight="bold"
            lineHeight="1.2"
          >
            Our Location
          </Typography>
        </Box>
        <Typography color="secondary" fontSize="small" component="address">
          10/1529, Kanchan Villa, Oswal Street, Near Shubhash Chowk, Gopipura,
          Surat, Gujarat, India 395001.
        </Typography>
      </Box>
      <Divider
        sx={{
          backgroundColor: alpha(theme.palette.secondary.main, 0.16),
          marginBottom: '16px',
        }}
      />
      <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
        <Typography
          color="secondary"
          fontSize="small"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <span style={{ fontWeight: 'bolder', fontSize: '24px' }}>
            &copy;&nbsp;
          </span>
          2024 Maia Jewellery | Powered By Triton Enterprise
        </Typography>
      </Box>
    </Box>
  );
}
