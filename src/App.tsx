import { Outlet, useLocation } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import { menuAtom } from '@/jotai/atoms/menu';
import { selectedDialogAtom } from '@/jotai/atoms/dialog';
import { useAtom, useAtomValue } from 'jotai';
import LiveChatButton from '@/components/LiveChat';
import NavDrawer from '@/components/NavDrawer';

function App() {
  const location = useLocation();
  const [, setShowMenu] = useAtom(menuAtom);
  const selectedDialog = useAtomValue(selectedDialogAtom);

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
