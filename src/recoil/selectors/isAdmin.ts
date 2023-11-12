import { selector } from 'recoil';
import { recoilKeys } from '@/recoil/data/recoilKeys';
import { userAtom } from '@/recoil/atoms';
import { isAdminEmail } from '@/config';

export const isAdminSelector = selector<boolean>({
  key: recoilKeys.isAdminSelector,
  get: ({ get }) => {
    const user = get(userAtom);
    if (!user || !user.user || !user.user.email) {
      return false;
    }
    return isAdminEmail(user.user.email);
  },
});
