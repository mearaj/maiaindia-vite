import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ProductPage from '@/pages/Product';
import CategoriesPage from '@/pages/Home';
import Providers from '@/providers';
import RightDrawer from '@/components/RightDrawer';
import GlobalModal from '@/components/GlobalModal';

function App() {
  return (
    <Providers>
      <RightDrawer />
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<CategoriesPage />} />
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/products/:id" element={<ProductPage />} />
        </Routes>
      </BrowserRouter>
      <GlobalModal />
    </Providers>
  );
}

export default App;
