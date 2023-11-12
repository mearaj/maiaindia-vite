export interface CartItems {
  [productID: string]: {
    quantity: number;
  };
}

export interface Cart {
  items: CartItems;
  updatedAt: number;
}

export const defaultPlaceholderCart: Cart = { items: {}, updatedAt: 0 };
