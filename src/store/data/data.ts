import LogoCircleDarkGreen from '@/assets/images/logo-circle-dark-green.png';

export interface CategoriesFilter {
  category: Category;
  sortBy: string;
}

export interface Category {
  name: string;
  id: string;
}

export const defaultCategory = { id: 'All', name: 'All' };

export interface Product {
  categoryID: string;
  id: string;
  images?: string[];
  name: string;
}

export interface ImageMetadate {
  src: string;
  width: number;
  height: number;
}

export const defaultPlaceholderImage: ImageMetadate = {
  src: LogoCircleDarkGreen,
  width: 425,
  height: 470,
};

export const categories: Category[] = [
  {
    id: 'All',
    name: 'All',
  },
  {
    id: 'V6LHSd8AFdxKTPofH5k9',
    name: 'Pendants',
  },
  {
    id: 'pnAW1Ey2GeW2KYnktEuG',
    name: 'Rings',
  },
  {
    id: 'tADYfOOYk7xRXac0dGpt',
    name: 'Bracelets',
  },
];

const res270x270 = '270x270';
const res540x540 = '540x540';
const res810x810 = '810x810';
const res1080x1080 = '1080x1080';
const res270x203 = '270x203';
const res540x405 = '540x405';
const res810x608 = '810x608';
const res1080x810 = '1080x810';

export const productResolutions = {
  res270x203,
  res270x270,
  res540x405,
  res540x540,
  res810x608,
  res810x810,
  res1080x810,
  res1080x1080,
};
