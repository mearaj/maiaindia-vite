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
import { useContext, useState } from 'react';
import { useAppDispatch } from '@/store';
import { setShowMenu } from '@/store/features/ui';
import { categories } from '@/data/store';
import {
  CategoriesContext,
  defaultSelectedCategory,
} from '@/providers/categories';

const availableCategories = [defaultSelectedCategory, ...categories];

export default function Categories() {
  const dispatch = useAppDispatch();
  const [expanded, setExpanded] = useState(false);
  const categoriesContext = useContext(CategoriesContext);
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
          value={categoriesContext.category.id}
          onChange={(_, v) => {
            const foundCategory = availableCategories.find(
              (eachCategory) => eachCategory.id === v
            );
            if (foundCategory) {
              categoriesContext.setCategory(foundCategory);
              dispatch(setShowMenu(false));
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
