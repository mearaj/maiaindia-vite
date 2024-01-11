import {
  FormControlLabel,
  Radio,
  RadioGroup,
  SxProps,
  Theme,
  Typography,
  useTheme,
} from '@mui/material';
import { useRecoilState } from 'recoil';
import { menuAtom } from '@/recoil/atoms/menu';
import { categoryAtom } from '@/recoil/atoms/category';
import { categories, defaultSelectedCategory } from '@/recoil/data/category';
import { ReactNode } from 'react';

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
  const [, setShowMenu] = useRecoilState(menuAtom);
  const [selectedCategory, setCategory] = useRecoilState(categoryAtom);
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
          color="primary"
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
                  color={radioColor || 'primary'}
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
                <Typography fontSize="medium" color={labelColor || 'primary'}>
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
