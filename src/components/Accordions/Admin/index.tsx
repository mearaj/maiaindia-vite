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
import { Add, AddTask, Home } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { NavLink, useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { isAdminSelector } from '@/recoil/selectors/isAdmin';
import { isActiveByEqual } from '@/misc';

import { appAbsoluteRoutes } from '@/Router';

export default function AdminAccordion() {
  const isAdmin = useRecoilValue(isAdminSelector);
  const [expanded, setExpanded] = useState(true);
  const location = useLocation();

  if (!isAdmin) {
    return null;
  }
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
        <Typography>Admin Navigation</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Link component={NavLink} to={appAbsoluteRoutes.adminHome}>
          <Button
            fullWidth
            variant={
              isActiveByEqual(
                [appAbsoluteRoutes.adminHome, appAbsoluteRoutes.admin],
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
        <Link component={NavLink} to={appAbsoluteRoutes.adminOrders}>
          <Button
            fullWidth
            variant={
              isActiveByEqual([appAbsoluteRoutes.adminOrders], location)
                ? 'contained'
                : 'outlined'
            }
            size="large"
            startIcon={<AddTask />}
            sx={linkButtonStyle}
          >
            Orders
          </Button>
        </Link>
        <Link component={NavLink} to={appAbsoluteRoutes.adminProductsAdd}>
          <Button
            fullWidth
            variant={
              isActiveByEqual([appAbsoluteRoutes.adminProductsAdd], location)
                ? 'contained'
                : 'outlined'
            }
            size="large"
            startIcon={<Add />}
            sx={linkButtonStyle}
          >
            Add Product
          </Button>
        </Link>
      </AccordionDetails>
    </Accordion>
  );
}
