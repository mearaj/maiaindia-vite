import { Location } from 'react-router-dom';

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
