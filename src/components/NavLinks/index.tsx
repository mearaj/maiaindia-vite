import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  Link,
  SxProps,
  Theme,
  Typography,
} from '@mui/material';
import {
  Add,
  AddTask,
  ContactPhone,
  ExpandMore,
  Home,
  Message,
  ShoppingBag,
} from '@mui/icons-material';
import InfoIcon from '@mui/icons-material/Info';
import PolicyIcon from '@mui/icons-material/Policy';
import ProfileIcon from '@mui/icons-material/AccountCircle';
import TermsConditions from '@mui/icons-material/Article';
import { NavLink, useLocation } from 'react-router-dom';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import { isActiveByEqual, isActiveByStartsWith } from '@/misc';

import { useRecoilValue } from 'recoil';
import { isAdminAtom } from '@/recoil/atoms/admin';
import { appAbsoluteRoutes } from '@/Router';

export default function NavLinks() {
  const isAdmin = useRecoilValue(isAdminAtom);
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
              color="primary"
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
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore color="primary" />}>
          <Typography color="primary">More</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Link component={NavLink} to={appAbsoluteRoutes.profile}>
            <Button
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
                Cancel/Refund Policy
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
        </AccordionDetails>
      </Accordion>
    </>
  );
}
