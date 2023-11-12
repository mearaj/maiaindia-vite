import { Outlet, useLocation } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { menuAtom } from '@/recoil/atoms/menu';
import NavDrawer from '@/components/NavDrawer';

// function AdminRoute() {
//   const isAdmin = useRecoilValue(isAdminSelector);
//   if (!isAdmin) {
//     return <Navigate to="/products" />;
//   }
//   return <Outlet />;
// }

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
      <Outlet />
      <NavDrawer />
    </>
  );
}

export default App;
