import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  homeActiveProductID: string;
  showMenu: boolean;
}

const initialState: UIState = {
  homeActiveProductID: '',
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
  },
});

export const { setHomeActiveProduct, setShowMenu } = uiSlice.actions;
export const uiReducer = uiSlice.reducer;
