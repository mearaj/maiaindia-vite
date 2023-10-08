import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  homeActiveProductID: string;
  showGlobalLoader: boolean;
  showMenu: boolean;
}

const initialState: UIState = {
  homeActiveProductID: '',
  showGlobalLoader: false,
  showMenu: false,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setHomeActiveProduct: (state, action: PayloadAction<string>) => {
      state.homeActiveProductID = action.payload;
    },
    setShowMenu: (state, action: PayloadAction<boolean>) => {
      state.showMenu = action.payload;
    },
    setShowGlobalLoader: (state, action: PayloadAction<boolean>) => {
      state.showGlobalLoader = action.payload;
    },
  },
});

export const { setHomeActiveProduct, setShowGlobalLoader, setShowMenu } =
  uiSlice.actions;
export const uiReducer = uiSlice.reducer;
