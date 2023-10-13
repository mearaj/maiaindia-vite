import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ProductPage from '@/pages/Product';
import CategoriesPage from '@/pages/Home';
import Providers from '@/providers';
import RightDrawer from '@/components/RightDrawer';
import AdminPage from '@/pages/Admin';
import CartPage from '@/pages/Cart';
import CustomPage from '@/pages/Custom';

function App() {
  return (
    <Providers>
      <RightDrawer />
      <BrowserRouter>
        <Routes>
          <Route index element={<Navigate to="/home" />} />
          <Route path="/home" element={<CategoriesPage />} />
          <Route path="/products/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/custom" element={<CustomPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </BrowserRouter>
    </Providers>
  );
}

export default App;
