import { FieldValue, Timestamp } from '@firebase/firestore';

export interface CartItems {
  // compoundID is productID + '-' + variantID
  [compoundID: string]: {
    quantity: number;
  };
}

export interface Cart {
  items: CartItems;
  updatedAt: Timestamp | FieldValue;
}
