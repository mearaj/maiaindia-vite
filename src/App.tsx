import { Outlet, useLocation } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { menuAtom } from '@/recoil/atoms/menu';
import { selectedDialogAtom } from '@/recoil/atoms/dialog';
import LiveChatButton from '@/components/LiveChat';
import NavDrawer from '@/components/NavDrawer';

function App() {
  const location = useLocation();
  const [, setShowMenu] = useRecoilState(menuAtom);
  const selectedDialog = useRecoilValue(selectedDialogAtom);

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
      <LiveChatButton />
      {selectedDialog}
    </>
  );
}

export default App;
