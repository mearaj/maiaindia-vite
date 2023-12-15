import { Location } from 'react-router-dom';
import { Cart, defaultPlaceholderCart } from '@/recoil/data/cart';
import { DocumentData, QuerySnapshot } from '@firebase/firestore';

export const isActiveByEqual = (currentPaths: string[], location: Location) => {
  for (let i = 0; i < currentPaths.length; i += 1) {
    if (location.pathname === currentPaths[i]) {
      return true;
    }
  }
  return false;
};

export const isActiveByStartsWith = (
  currentPaths: string[],
  location: Location
) => {
  for (let i = 0; i < currentPaths.length; i += 1) {
    if (location.pathname.startsWith(currentPaths[i])) {
      return true;
    }
  }
  return false;
};

export const mergeCartItems = (localCart: Cart, apiCart: Cart): Cart => {
  const localCartKeys = Object.keys(localCart.items ?? {});
  const apiCartKeys = Object.keys(apiCart.items ?? {});
  if (localCartKeys.length === 0) {
    return apiCart;
  }
  if (apiCartKeys.length === 0) {
    return localCart;
  }
  let cart: Cart = defaultPlaceholderCart;
  const mergedKeys = [...localCartKeys, ...apiCartKeys];
  const mergedUniqueKeys = mergedKeys.filter((eachKey, index, origArray) => {
    return origArray.indexOf(eachKey) === index;
  });
  mergedUniqueKeys.forEach((eachKey) => {
    let quantity = 0;
    if (localCart.items[eachKey]) {
      quantity = localCart.items[eachKey].quantity;
    }
    if (apiCart.items[eachKey]) {
      quantity =
        apiCart.items[eachKey].quantity > quantity
          ? apiCart.items[eachKey].quantity
          : quantity;
    }
    if (quantity > 0) {
      cart = { ...cart, items: { ...cart.items, [eachKey]: { quantity } } };
    }
  });
  return cart;
};

export const updateDocsSnapshots = <T extends { id: string }>(
  snapshot: QuerySnapshot<DocumentData, DocumentData>,
  snapDocs: T[]
) => {
  snapshot
    .docChanges()
    .forEach((change: { doc: { data?: any; id?: any }; type: string }) => {
      const { id } = change.doc;
      const foundIndex = snapDocs.findIndex((docItem) => docItem.id === id);
      const docItem = {
        ...change.doc.data(),
        id,
      };
      switch (change.type) {
        case 'added':
        case 'modified':
          if (foundIndex >= 0) {
            snapDocs[foundIndex] = docItem;
          } else {
            snapDocs.unshift(docItem);
          }
          break;
        case 'removed':
          if (foundIndex >= 0) {
            snapDocs.splice(foundIndex, 1);
          }
          break;
        default:
          break;
      }
    });
  return snapDocs;
};
