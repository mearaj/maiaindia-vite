import {
  FormControlLabel,
  Radio,
  RadioGroup,
  SxProps,
  Theme,
  Typography,
  useTheme,
} from '@mui/material';
import { menuAtom } from '@/jotai/atoms/menu';
import { categoryAtom } from '@/jotai/atoms/category';
import { categories, defaultSelectedCategory } from '@/jotai/data/category';
import { ReactNode } from 'react';
import { useAtom } from 'jotai';

const availableCategories = [defaultSelectedCategory, ...categories];

export default function CategoriesRadio({
  title,
  labelColor,
  radioColor,
  radioGroupSx,
}: {
  title?: ReactNode;
  labelColor?: string;
  radioColor?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'error'
    | 'info'
    | 'success'
    | 'warning';
  radioGroupSx?: SxProps<Theme>;
}) {
  const [, setShowMenu] = useAtom(menuAtom);
  const [selectedCategory, setCategory] = useAtom(categoryAtom);
  const theme = useTheme();
  return (
    <>
      {title || (
        <Typography
          sx={{
            fontWeight: 'bold',
            margin: '0 0 8px 4px',
            fontSize: '18px',
          }}
          color="secondary"
        >
          Filter By Category
        </Typography>
      )}
      <RadioGroup
        value={selectedCategory.id}
        onChange={(_, v) => {
          const foundCategory = availableCategories.find(
            (eachCategory) => eachCategory.id === v
          );
          if (foundCategory) {
            setCategory(foundCategory);
            setShowMenu(() => false);
          }
        }}
        sx={
          radioGroupSx || {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px,1fr))',
            marginLeft: '12px',
          }
        }
      >
        {availableCategories.map((eachCategory) => {
          return (
            <FormControlLabel
              key={eachCategory.id}
              value={eachCategory.id}
              control={
                <Radio
                  color={radioColor || 'secondary'}
                  size="small"
                  sx={{
                    '&.MuiRadio-colorSecondary': {
                      color: theme.palette.secondary.main,
                      height: '28px',
                      width: '28px',
                      marginLeft: '4px',
                    },
                  }}
                />
              }
              label={
                <Typography fontSize="medium" color={labelColor || 'secondary'}>
                  {eachCategory.name}
                </Typography>
              }
            />
          );
        })}
      </RadioGroup>
    </>
  );
}
