import { Box, Button, Divider, Link, SxProps, Theme } from '@mui/material';
import {
  Add,
  AddTask,
  ContactPhone,
  Home,
  Message,
  ShoppingBag,
} from '@mui/icons-material';
import InfoIcon from '@mui/icons-material/Info';
import PolicyIcon from '@mui/icons-material/Policy';
import ProfileIcon from '@mui/icons-material/AccountCircle';
import TermsConditions from '@mui/icons-material/Article';
import { NavLink, useLocation } from 'react-router-dom';
import { isActiveByEqual, isActiveByStartsWith } from '@/misc';

import { isAdminAtom } from '@/jotai/atoms/admin';
import { useAtomValue } from 'jotai/index';
import { appAbsoluteRoutes } from '@/Router';

export default function NavLinks() {
  const isAdmin = useAtomValue(isAdminAtom);
  const location = useLocation();

  const linkButtonStyle: SxProps<Theme> = {
    justifyContent: 'flex-start',
    marginBottom: '4px',
    textTransform: 'none',
    maxHeight: '100%',
  };

  return (
    <>
      {isAdmin && (
        <>
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
              color="secondary"
            >
              Admin Orders
            </Button>
          </Link>
          <Link component={NavLink} to={appAbsoluteRoutes.adminProducts}>
            <Button
              fullWidth
              variant={
                isActiveByEqual([appAbsoluteRoutes.adminProducts], location)
                  ? 'contained'
                  : 'text'
              }
              size="large"
              color="secondary"
              startIcon={<ShoppingBag />}
              sx={{
                ...linkButtonStyle,
                marginBottom: '4px',
              }}
            >
              Admin Products
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
              color="secondary"
              size="large"
              startIcon={<Add />}
              sx={{
                ...linkButtonStyle,
                marginBottom: '4px',
              }}
            >
              Admin Add Product
            </Button>
          </Link>
          <Link component={NavLink} to={appAbsoluteRoutes.adminLiveChat}>
            <Button
              fullWidth
              variant={
                isActiveByEqual([appAbsoluteRoutes.adminLiveChat], location)
                  ? 'contained'
                  : 'text'
              }
              size="large"
              color="secondary"
              startIcon={<Message />}
              sx={linkButtonStyle}
            >
              Live Chat
            </Button>
          </Link>
        </>
      )}
      {isAdmin && (
        <Divider
          sx={{
            margin: '16px 0px',
          }}
        />
      )}
      <Link component={NavLink} to={appAbsoluteRoutes.home}>
        <Button
          color="secondary"
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
      <Link component={NavLink} to={appAbsoluteRoutes.profile}>
        <Button
          color="secondary"
          fullWidth
          variant={
            isActiveByEqual([appAbsoluteRoutes.profile], location)
              ? 'contained'
              : 'text'
          }
          size="large"
          startIcon={<ProfileIcon />}
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
            Profile
          </Box>
        </Button>
      </Link>
      <Link component={NavLink} to={appAbsoluteRoutes.contactUs}>
        <Button
          color="secondary"
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
      <Link component={NavLink} to={appAbsoluteRoutes.aboutUs}>
        <Button
          color="secondary"
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
          color="secondary"
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
            Cancel/Refund Policy
          </Box>
        </Button>
      </Link>
      <Link component={NavLink} to={appAbsoluteRoutes.termsConditions}>
        <Button
          color="secondary"
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
          color="secondary"
          fullWidth
          variant={
            isActiveByEqual([appAbsoluteRoutes.privacyPolicy], location)
              ? 'contained'
              : 'text'
          }
          size="large"
          startIcon={<PolicyIcon />}
          sx={{ ...linkButtonStyle, marginBottom: '0px' }}
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
    </>
  );
}
