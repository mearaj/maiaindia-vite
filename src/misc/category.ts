export interface Category {
  name: string;
  id: string;
}

export const defaultSelectedCategory: Category = { name: 'All', id: 'All' };

export const categories: Category[] = [
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
  {
    id: '5cEmfaZG7zoj68rt388C',
    name: 'Custom',
  },
];
