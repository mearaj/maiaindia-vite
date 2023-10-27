import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { menuAtom } from '@/recoil/atoms/menu';
import ProductPage from '@/pages/Product';
import HomePage from '@/pages/Home';
import CartPage from '@/pages/Cart';
import CustomPage from '@/pages/Custom';
import AdminHomePage from '@/pages/Admin/Home';
import AdminOrdersPage from '@/pages/Admin/Orders';
import AdminAddProductPage from '@/pages/Admin/AddProduct';
import NavDrawer from '@/components/NavDrawer';

function App() {
  const location = useLocation();
  const [, setShowMenu] = useRecoilState(menuAtom);

  const closeDrawer = useCallback(() => {
    setShowMenu(false);
  }, [setShowMenu]);

  useEffect(() => {
    closeDrawer();
  }, [closeDrawer, location]);

  return (
    <>
      <Routes>
        <Route>
          <Route path="" element={<Navigate to="/home" />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/products/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/custom" element={<CustomPage />} />
          <Route path="/admin" element={<Navigate to="/admin/home" />} />
          <Route path="/admin/home" element={<AdminHomePage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/products/add" element={<AdminAddProductPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
      <NavDrawer />
    </>
  );
}

export default App;
