import * as React from 'react';
import { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Menu,
  MenuItem,
  SxProps,
  Theme,
  useTheme,
} from '@mui/material';
import Button from '@mui/material/Button';
import { categories, Category } from '@/jotai/data/category';
import { KeyboardArrowDown } from '@mui/icons-material';

export interface CategoriesDropdownProps {
  selectedCategory: Category;
  onCategoriesChange: (category: Category) => void;
  disableForm: boolean;
}

export default function CategoriesDropdown({
  selectedCategory,
  onCategoriesChange,
  disableForm,
}: CategoriesDropdownProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleCategoryChange = (category: Category) => {
    setAnchorEl(null);
    onCategoriesChange(category);
  };

  let formLabelSx: SxProps<Theme> = {
    marginBottom: '4px',
    fontSize: '14px',
    fontWeight: 600,
  };
  const formControlStyle = {
    marginBottom: '16px',
    width: '100%',
  };
  if (anchorEl != null) {
    formLabelSx = {
      ...formLabelSx,
      color: theme.palette.primary.dark,
    };
  }

  return (
    <FormControl sx={formControlStyle}>
      <FormLabel sx={formLabelSx} htmlFor="categories-button">
        Select Category&nbsp;*
      </FormLabel>
      <Button
        sx={{ textTransform: 'none', justifyContent: 'space-between' }}
        id="categories-button"
        variant="outlined"
        onClick={handleClick}
        endIcon={<KeyboardArrowDown />}
        fullWidth
        disabled={disableForm}
      >
        {selectedCategory.name}
      </Button>
      <Menu
        id="categories-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{ '& .MuiPaper-root': { width: '100%' } }}
        MenuListProps={{
          'aria-labelledby': 'categories-menu',
        }}
      >
        {categories
          .filter((eachCategory) => eachCategory.id !== selectedCategory.id)
          .map((eachCategory) => {
            return (
              <MenuItem
                key={eachCategory.id}
                sx={{ minHeight: '0px' }}
                disabled={disableForm}
                onClick={() => handleCategoryChange(eachCategory)}
              >
                {eachCategory.name}
              </MenuItem>
            );
          })}
      </Menu>
    </FormControl>
  );
}
