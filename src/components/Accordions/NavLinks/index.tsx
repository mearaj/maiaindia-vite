import { Box, Button, Link, SxProps, Theme } from '@mui/material';
import { Add, AddTask, ContactPhone, Home, Message } from '@mui/icons-material';
import InfoIcon from '@mui/icons-material/Info';
import PolicyIcon from '@mui/icons-material/Policy';
import TermsConditions from '@mui/icons-material/Article';
import { NavLink, useLocation } from 'react-router-dom';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import { isActiveByEqual, isActiveByStartsWith } from '@/misc';

import { useRecoilValue } from 'recoil';
import { isAdminSelector } from '@/recoil/selectors/isAdmin';
import { appAbsoluteRoutes } from '@/Router';

export default function NavLinksAccordion() {
  const isAdmin = useRecoilValue(isAdminSelector);
  const location = useLocation();

  const linkButtonStyle: SxProps<Theme> = {
    justifyContent: 'flex-start',
    marginBottom: '8px',
    textTransform: 'none',
    maxHeight: '100%',
  };

  return (
    <>
      <Link component={NavLink} to={appAbsoluteRoutes.home}>
        <Button
          fullWidth
          variant={
            isActiveByStartsWith(
              [appAbsoluteRoutes.home, appAbsoluteRoutes.products],
              location
            )
              ? 'contained'
              : 'text'
          }
          size="large"
          startIcon={<Home />}
          sx={linkButtonStyle}
        >
          Home
        </Button>
      </Link>
      <Link component={NavLink} to={appAbsoluteRoutes.cart}>
        <Button
          fullWidth
          variant={
            isActiveByEqual([appAbsoluteRoutes.cart], location)
              ? 'contained'
              : 'text'
          }
          size="large"
          startIcon={<ShoppingCart />}
          sx={linkButtonStyle}
        >
          Cart
        </Button>
      </Link>
      <Link component={NavLink} to={appAbsoluteRoutes.contactUs}>
        <Button
          fullWidth
          variant={
            isActiveByEqual([appAbsoluteRoutes.contactUs], location)
              ? 'contained'
              : 'text'
          }
          size="large"
          startIcon={<ContactPhone />}
          sx={linkButtonStyle}
        >
          Contact Us
        </Button>
      </Link>
      <Link component={NavLink} to={appAbsoluteRoutes.liveChat}>
        <Button
          fullWidth
          variant={
            isActiveByEqual([appAbsoluteRoutes.liveChat], location)
              ? 'contained'
              : 'text'
          }
          size="large"
          startIcon={<Message />}
          sx={linkButtonStyle}
        >
          Live Chat
        </Button>
      </Link>
      <Link component={NavLink} to={appAbsoluteRoutes.aboutUs}>
        <Button
          fullWidth
          variant={
            isActiveByEqual([appAbsoluteRoutes.aboutUs], location)
              ? 'contained'
              : 'text'
          }
          size="large"
          startIcon={<InfoIcon />}
          sx={linkButtonStyle}
        >
          About Us
        </Button>
      </Link>
      <Link
        component={NavLink}
        to={appAbsoluteRoutes.cancellationRefundPolicies}
      >
        <Button
          fullWidth
          variant={
            isActiveByEqual(
              [appAbsoluteRoutes.cancellationRefundPolicies],
              location
            )
              ? 'contained'
              : 'text'
          }
          size="large"
          startIcon={<PolicyIcon />}
          sx={linkButtonStyle}
        >
          <Box
            component="span"
            sx={{
              whiteSpace: 'nowrap',
              overflowX: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            Cancellation And Refund Policies
          </Box>
        </Button>
      </Link>
      <Link component={NavLink} to={appAbsoluteRoutes.termsConditions}>
        <Button
          fullWidth
          variant={
            isActiveByEqual([appAbsoluteRoutes.termsConditions], location)
              ? 'contained'
              : 'text'
          }
          size="large"
          startIcon={<TermsConditions />}
          sx={linkButtonStyle}
        >
          <Box
            component="span"
            sx={{
              whiteSpace: 'nowrap',
              overflowX: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            Terms And Conditions
          </Box>
        </Button>
      </Link>
      <Link component={NavLink} to={appAbsoluteRoutes.privacyPolicy}>
        <Button
          fullWidth
          variant={
            isActiveByEqual([appAbsoluteRoutes.privacyPolicy], location)
              ? 'contained'
              : 'text'
          }
          size="large"
          startIcon={<PolicyIcon />}
          sx={linkButtonStyle}
        >
          <Box
            component="span"
            sx={{
              whiteSpace: 'nowrap',
              overflowX: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            Privacy Policy
          </Box>
        </Button>
      </Link>
      {isAdmin && (
        <>
          <Link component={NavLink} to={appAbsoluteRoutes.adminHome}>
            <Button
              fullWidth
              variant={
                isActiveByEqual(
                  [appAbsoluteRoutes.adminHome, appAbsoluteRoutes.admin],
                  location
                )
                  ? 'contained'
                  : 'text'
              }
              size="large"
              startIcon={<Home />}
              sx={linkButtonStyle}
            >
              Admin Home
            </Button>
          </Link>
          <Link component={NavLink} to={appAbsoluteRoutes.adminOrders}>
            <Button
              fullWidth
              variant={
                isActiveByEqual([appAbsoluteRoutes.adminOrders], location)
                  ? 'contained'
                  : 'text'
              }
              size="large"
              startIcon={<AddTask />}
              sx={linkButtonStyle}
            >
              Admin Orders
            </Button>
          </Link>
          <Link component={NavLink} to={appAbsoluteRoutes.adminProductsAdd}>
            <Button
              fullWidth
              variant={
                isActiveByEqual([appAbsoluteRoutes.adminProductsAdd], location)
                  ? 'contained'
                  : 'text'
              }
              size="large"
              startIcon={<Add />}
              sx={linkButtonStyle}
            >
              Admin Add Product
            </Button>
          </Link>
        </>
      )}
    </>
  );
}
