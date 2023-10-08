import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Category, defaultCategory } from '@/store/data/data';

interface CategoryState {
  selectedCategory: Category;
}

const initialState: CategoryState = {
  selectedCategory: defaultCategory,
};

export const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<Category>) => {
      state.selectedCategory = action.payload;
    },
  },
});

export const { setCategory } = categorySlice.actions;
export const categoryReducer = categorySlice.reducer;
