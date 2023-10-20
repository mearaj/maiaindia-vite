export interface CategoriesFilter {
  category: Category;
  sortBy: string;
}

export interface Category {
  name: string;
  id: string;
}

export interface ProductPrice {
  timestamp: number;
  currency: string;
  mrp: number;
  sp: number;
}

export interface Product {
  categoryID: string;
  id: string;
  images?: string[];
  name: string;
  price: ProductPrice;
  priceHistory?: ProductPrice[];
}

export interface ImageMetadata {
  srcSet?: string;
  src?: string;
  sizes?: string;
}

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
