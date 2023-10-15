import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  showMenu: boolean;
}

const initialState: UIState = {
  showMenu: false,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setShowMenu: (state, action: PayloadAction<boolean>) => {
      state.showMenu = action.payload;
    },
  },
});

export const { setShowMenu } = uiSlice.actions;
export const uiReducer = uiSlice.reducer;
