import { Outlet, useLocation } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import { menuAtom } from '@/jotai/atoms/menu';
import { selectedDialogAtom } from '@/jotai/atoms/dialog';
import { useAtom, useAtomValue } from 'jotai';
import { userAtomEffect } from '@/jotai/atoms/user';
import {
  adminOnlineStatusesAtomEffect,
  adminUsersAtomEffect,
  isAdminAtomEffect,
} from '@/jotai/effects/admin';

import { appOnlineStatusAtomEffect } from '@/jotai/effects/app';
import { allProductsAtomEffect } from '@/jotai/effects/products';
import {
  adminSupportChatSessionsEffect,
  currentUserLastActiveChatSessionAtomEffect,
} from '@/jotai/effects/supportChat';
import CartDrawer from '@/components/CartDrawer';
import LiveChatButton from '@/components/LiveChat';

function App() {
  const location = useLocation();
  const [, setShowMenu] = useAtom(menuAtom);
  const selectedDialog = useAtomValue(selectedDialogAtom);

  useAtom(userAtomEffect);
  useAtom(allProductsAtomEffect);
  useAtom(isAdminAtomEffect);
  useAtom(adminUsersAtomEffect);
  useAtom(adminOnlineStatusesAtomEffect);
  useAtom(appOnlineStatusAtomEffect);
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
