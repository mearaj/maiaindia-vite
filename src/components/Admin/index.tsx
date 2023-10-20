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
import { useContext, useState } from 'react';
import { Add, AddTask, Home } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { NavLink } from 'react-router-dom';
import { FirebaseContext } from '@/providers/firebase';

export default function AdminComponent() {
  const { isAdmin } = useContext(FirebaseContext);
  const [expanded, setExpanded] = useState(false);

  if (!isAdmin()) {
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
        <Typography>Admin</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Link component={NavLink} to="/admin/home">
          <Button
            fullWidth
            variant="outlined"
            size="large"
            startIcon={<Home />}
            sx={linkButtonStyle}
          >
            Home
          </Button>
        </Link>
        <Link component={NavLink} to="/admin/orders">
          <Button
            fullWidth
            variant="outlined"
            size="large"
            startIcon={<AddTask />}
            sx={linkButtonStyle}
          >
            Orders
          </Button>
        </Link>
        <Link component={NavLink} to="/admin/products/add">
          <Button
            fullWidth
            variant="outlined"
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
