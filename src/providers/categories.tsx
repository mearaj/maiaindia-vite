// import {
//   createContext,
//   PropsWithChildren,
//   useContext,
//   useMemo,
//   useState,
// } from 'react';
// import { Category } from '@/data/store';
//
// interface CategoryState {
//   category: Category;
//   setCategory: (category: Category) => void;
// }
//
// export const defaultSelectedCategory = { name: 'All', id: 'All' };
//
// const initialCategory = {
//   category: defaultSelectedCategory,
//   setCategory: () => {},
// };
// export const CategoriesContext = createContext<CategoryState>(initialCategory);
//
// export default function CategoriesProvider({ children }: PropsWithChildren) {
//   const initialCategoryState = useContext(CategoriesContext);
//   const [category, setCategory] = useState(initialCategoryState.category);
//
//   const categoryState = useMemo<CategoryState>(
//     () => ({
//       category,
//       setCategory,
//     }),
//     [category]
//   );
//
//   return (
//     <CategoriesContext.Provider value={categoryState}>
//       {children}
//     </CategoriesContext.Provider>
//   );
// }
