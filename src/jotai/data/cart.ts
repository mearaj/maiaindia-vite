import { FieldValue, Timestamp } from '@firebase/firestore';

export interface CartItems {
  // compoundID is productID + '-' + variantID
  [compoundID: string]: {
    quantity: number;
    createdAt: FieldValue | Timestamp;
  };
}

export interface Cart {
  items: CartItems;
}
