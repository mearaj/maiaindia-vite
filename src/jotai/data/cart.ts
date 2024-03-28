import { FieldValue, Timestamp } from '@firebase/firestore';

export interface CartItems {
  [productID: string]: {
    quantity: number;
  };
}

export interface Cart {
  items: CartItems;
  updatedAt: Timestamp | FieldValue;
}
