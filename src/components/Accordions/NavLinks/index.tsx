import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Link,
  SxProps,
  Theme,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { ContactPhone, Home, Message } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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
      </AccordionDetails>
    </Accordion>
  );
}
