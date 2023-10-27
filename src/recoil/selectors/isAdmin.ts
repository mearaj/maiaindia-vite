import { selector } from 'recoil';
import { recoilKeys } from '@/recoil/data/recoilKeys';
import { userAtom } from '@/recoil/atoms';

export const isAdminSelector = selector<boolean>({
  key: recoilKeys.isAdminSelector,
  get: ({ get }) => {
    const user = get(userAtom);
    if (!user) {
      return false;
    }
    const adminUsers = import.meta.env.VITE_ADMIN_EMAIL.split(',');
    for (let i = 0; i < adminUsers.length; i += 1) {
      if (user.email === adminUsers[i]) {
        return true;
      }
    }
    return false;
  },
});
