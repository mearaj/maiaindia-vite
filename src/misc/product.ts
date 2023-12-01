import { FieldValue, Timestamp } from '@firebase/firestore';

export interface ProductPrice {
  timestamp: FieldValue | Timestamp;
  currency: string;
  mrp: number;
  sp: number;
}

export interface ProductImage {
  name: string;
  height: number;
  width: number;
  src?: string;
}

export interface ProductWithoutID {
  categoryID: string;
  images?: ProductImage[];
  name: string;
  price: ProductPrice;
  priceHistory?: ProductPrice[];
}

export interface Product extends ProductWithoutID {
  id: string;
}
