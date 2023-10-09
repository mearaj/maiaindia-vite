import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ProductPage from '@/pages/Product';
import CategoriesPage from '@/pages/Home';
import Providers from '@/providers';
import RightDrawer from '@/components/RightDrawer';

function App() {
  return (
    <Providers>
      <BrowserRouter>
        <RightDrawer />
        <Routes>
          <Route path="/home" element={<CategoriesPage />} />
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/products/:id" element={<ProductPage />} />
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </BrowserRouter>
    </Providers>
  );
}

export default App;
