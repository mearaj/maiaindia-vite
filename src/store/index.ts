import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { apiSlice } from '@/store/api/api';
import { categoryReducer } from '@/store/features/category';
import { uiReducer } from '@/store/features/ui';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    categoryReducer,
    uiReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: [apiSlice.reducerPath],
      },
    }).concat(apiSlice.middleware);
  },
});

setupListeners(store.dispatch);

export const selectCategory = (state: RootState) =>
  state.categoryReducer.selectedCategory;

export const selectHomeActiveProduct = (state: RootState) =>
  state.uiReducer.homeActiveProductID;

export const selectShowMenu = (state: RootState) => state.uiReducer.showMenu;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export { useGetProductsQuery, useGetProductQuery } from './api/api';
