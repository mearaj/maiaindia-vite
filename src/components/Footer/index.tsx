import { alpha, Box, Divider, Link, Typography, useTheme } from '@mui/material';
import { NavLink } from 'react-router-dom';
import createStyles from './styles';
import { appAbsoluteRoutes } from '@/Router';
import CategoriesRadio from '@/components/Categories';
import FacebookIcon from '@/icons/facebookIcon';
import InstagramIcon from '@/icons/instagramIcon';
import YoutubeIcon from '@/icons/youtubeIcon';
import PinIcon from '@/icons/pinIcon';

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
            fontSize="medium"
          >
            Privacy Policy
          </Link>
          <Link
            component={NavLink}
            to={appAbsoluteRoutes.cancellationRefundPolicies}
            color="secondary"
            fontSize="medium"
          >
            Cancellation & Refund Policy
          </Link>
          <Link
            component={NavLink}
            to={appAbsoluteRoutes.cancellationRefundPolicies}
            color="secondary"
            fontSize="medium"
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
            fontSize="medium"
          >
            WhatsApp / Live Chat
          </Link>
          <Link
            component={NavLink}
            to="tel:+91-9173169661"
            color="secondary"
            fontSize="medium"
          >
            Mobile: +91-9173169661
          </Link>
          <Link
            component={NavLink}
            to="mailto:proud@maiaindia.com"
            color="secondary"
            fontSize="medium"
          >
            Email: proud@maiaindia.com
          </Link>
        </Box>
      </Box>
      <Box sx={styles.container}>
        <Box sx={styles.contentTitle}>
          <Typography color="secondary" fontSize="large" fontWeight="bold">
            About Us
          </Typography>
        </Box>
        <Box sx={styles.content}>
          <Link
            component={NavLink}
            to={appAbsoluteRoutes.aboutUs}
            color="secondary"
            fontSize="medium"
          >
            About Maia Jewellery
          </Link>
        </Box>
      </Box>
      <Box sx={styles.container}>
        <Box sx={{ ...styles.contentTitle, marginBottom: '4px' }}>
          <Typography color="secondary" fontSize="large" fontWeight="bold">
            Social Links
          </Typography>
        </Box>
        <Box sx={styles.iconsContainer}>
          <Link
            component={NavLink}
            to="https://www.instagram.com/_maiaindia_?igsh=MTg4bHA5eDM0eWk3NA=="
            color="secondary"
            fontSize="medium"
            target="_blank"
            sx={{ padding: '0px' }}
          >
            <Box sx={{ ...styles.iconContainer }}>
              <FacebookIcon fontSize="32px" />
            </Box>
          </Link>
          <Link
            component={NavLink}
            to="https://www.facebook.com/profile.php?id=100093529567691&mibextid=hIlR13"
            color="secondary"
            fontSize="medium"
            target="_blank"
          >
            <Box sx={{ ...styles.iconContainer }}>
              <InstagramIcon fontSize="32px" />
            </Box>
          </Link>
          <Link
            component={NavLink}
            to="https://youtube.com/@maiaindia?si=4uJcIbZDMPhIJR-1"
            color="secondary"
            fontSize="medium"
            target="_blank"
          >
            <Box
              sx={{
                ...styles.iconContainer,
              }}
            >
              <YoutubeIcon fontSize="32px" />
            </Box>
          </Link>
          <Link
            component={NavLink}
            to="https://pin.it/yPnIzzf"
            color="secondary"
            fontSize="medium"
            target="_blank"
          >
            <Box
              sx={{
                ...styles.iconContainer,
              }}
            >
              <PinIcon fontSize="32px" />
            </Box>
          </Link>
        </Box>
      </Box>
      <Box style={styles.container}>
        <Box style={styles.contentTitle}>
          <Typography color="secondary" fontSize="large" fontWeight="bold">
            Our Location
          </Typography>
        </Box>
        <Typography
          color="secondary"
          fontSize="medium"
          component="address"
          fontStyle="normal"
        >
          10/1529, Kanchan Villa, Oswal Street, Near Shubhash Chowk, Gopipura,
          Surat, Gujarat, India 395001.
        </Typography>
      </Box>
      <Divider
        sx={{
          backgroundColor: alpha(theme.palette.secondary.main, 0.16),
          marginBottom: '4px',
        }}
      />
      <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
        <Typography
          color="secondary"
          fontSize="medium"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <span style={{ fontWeight: 'bolder', fontSize: '32px' }}>
            &copy;&nbsp;
          </span>
          2024 Maia Jewellery | Powered By Triton Enterprise
        </Typography>
      </Box>
    </Box>
  );
}
