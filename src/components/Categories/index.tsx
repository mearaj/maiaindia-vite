import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { menuAtom } from '@/recoil/atoms/menu';
import { categoryAtom } from '@/recoil/atoms/category';
import { categories, defaultSelectedCategory } from '@/recoil/data/category';

const availableCategories = [defaultSelectedCategory, ...categories];

export default function Categories() {
  const [expanded, setExpanded] = useState(false);
  const [, setShowMenu] = useRecoilState(menuAtom);
  const [selectedCategory, setCategory] = useRecoilState(categoryAtom);
  return (
    <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>Categories</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <RadioGroup
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          value={selectedCategory.id}
          onChange={(_, v) => {
            const foundCategory = availableCategories.find(
              (eachCategory) => eachCategory.id === v
            );
            if (foundCategory) {
              setCategory(foundCategory);
              setShowMenu(() => false);
              setExpanded(false);
            }
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
      </AccordionDetails>
    </Accordion>
  );
}
