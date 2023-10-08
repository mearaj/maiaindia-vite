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
import { selectCategory, useAppDispatch, useAppSelector } from '@/store';
import { setCategory } from '@/store/features/category';
import { categories } from '@/store/data/data';
import { setShowMenu } from '@/store/features/ui.ts';
import styles from './index.module.css';

export default function Categories({ className }: { className?: string }) {
  const dispatch = useAppDispatch();
  const [expanded, setExpanded] = useState(false);
  let accordionClassName = styles.accordion;
  if (className) {
    accordionClassName = `${accordionClassName} ${className}`;
  }
  return (
    <Accordion
      className={accordionClassName}
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
    >
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
          value={useAppSelector(selectCategory).id}
          onChange={(_, v) => {
            const foundCategory = categories.find(
              (category) => category.id === v
            );
            if (foundCategory) {
              dispatch(setCategory(foundCategory));
              dispatch(setShowMenu(false));
              setExpanded(false);
            }
          }}
        >
          {categories.map((category) => {
            return (
              <FormControlLabel
                key={category.id}
                value={category.id}
                control={<Radio />}
                label={category.name}
              />
            );
          })}
        </RadioGroup>
      </AccordionDetails>
    </Accordion>
  );
}
