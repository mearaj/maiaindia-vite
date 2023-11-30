import { FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
import { useRecoilState } from 'recoil';
import { menuAtom } from '@/recoil/atoms/menu';
import { categoryAtom } from '@/recoil/atoms/category';
import { categories, defaultSelectedCategory } from '@/firebase/category';

const availableCategories = [defaultSelectedCategory, ...categories];

export default function CategoriesAccordion() {
  const [, setShowMenu] = useRecoilState(menuAtom);
  const [selectedCategory, setCategory] = useRecoilState(categoryAtom);
  return (
    <>
      <Typography
        sx={{ fontWeight: 'bold', margin: '16px 0 8px 0', fontSize: '20px' }}
      >
        Filter by category
      </Typography>
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
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(100px,1fr))',
        }}
      >
        {availableCategories.map((eachCategory) => {
          return (
            <FormControlLabel
              key={eachCategory.id}
              value={eachCategory.id}
              control={<Radio />}
              label={eachCategory.name}
            />
          );
        })}
      </RadioGroup>
    </>
  );
}
