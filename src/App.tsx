import { Outlet, useLocation } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import { menuAtom } from '@/jotai/atoms/menu';
import { selectedDialogAtom } from '@/jotai/atoms/dialog';
import { useAtom, useAtomValue } from 'jotai';
import { adminUsersAtomEffect, isAdminAtomEffect } from '@/jotai/effects/admin';

import { allProductsAtomEffect } from '@/jotai/effects/products';
import {
  adminSupportChatSessionsEffect,
  currentUserLastActiveChatSessionAtomEffect,
} from '@/jotai/effects/supportChat';
import { onAuthStateChangedEffect, userAtomEffect } from '@/jotai/effects/user';
import CartDrawer from '@/components/CartDrawer';
import LiveChatButton from '@/components/LiveChat';

function App() {
  const location = useLocation();
  const [, setShowMenu] = useAtom(menuAtom);
  const selectedDialog = useAtomValue(selectedDialogAtom);

  useAtom(onAuthStateChangedEffect);
  useAtom(userAtomEffect);
  useAtom(allProductsAtomEffect);
  useAtom(isAdminAtomEffect);
  useAtom(adminUsersAtomEffect);
  useAtom(currentUserLastActiveChatSessionAtomEffect);
  useAtom(adminSupportChatSessionsEffect);

  const closeDrawer = useCallback(() => {
    setShowMenu(false);
  }, [setShowMenu]);

  useEffect(() => {
    closeDrawer();
  }, [closeDrawer, location]);

  return (
    <>
      <Outlet />
      <CartDrawer />
      <LiveChatButton />
      {selectedDialog}
    </>
  );
}

export default App;
