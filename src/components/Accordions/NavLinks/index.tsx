import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Link,
  SxProps,
  Theme,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { ContactPhone, Home, Message } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import PolicyIcon from '@mui/icons-material/Policy';
import TermsConditions from '@mui/icons-material/Article';
import { NavLink, useLocation } from 'react-router-dom';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import { isActiveByEqual, isActiveByStartsWith } from '@/misc';

import { appAbsoluteRoutes } from '@/Router';

export default function NavLinksAccordion() {
  const [expanded, setExpanded] = useState(true);
  const location = useLocation();

  const linkButtonStyle: SxProps<Theme> = {
    justifyContent: 'flex-start',
    marginBottom: '8px',
    textTransform: 'none',
    maxHeight: '100%',
  };

  return (
    <Accordion
      expanded={expanded}
      onChange={(___) => setExpanded(!expanded)}
      sx={{
        backgroundColor: 'transparent',
        color: 'inherit',
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Navigation</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Link component={NavLink} to={appAbsoluteRoutes.home}>
          <Button
            fullWidth
            variant={
              isActiveByStartsWith(
                [appAbsoluteRoutes.home, appAbsoluteRoutes.products],
                location
              )
                ? 'contained'
                : 'outlined'
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
                : 'outlined'
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
                : 'outlined'
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
                : 'outlined'
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
                : 'outlined'
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
                : 'outlined'
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
                : 'outlined'
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
      </AccordionDetails>
    </Accordion>
  );
}
