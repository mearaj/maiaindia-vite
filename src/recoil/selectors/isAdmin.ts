import { selector } from 'recoil';
import { recoilKeys } from '@/recoil/data/recoilKeys';
import { userAtom } from '@/recoil/atoms';
import { isAdminUID } from '@/config';

export const isAdminSelector = selector<boolean>({
  key: recoilKeys.isAdminSelector,
  get: ({ get }) => {
    const { userState } = get(userAtom);
    if (!userState || !userState.user || !userState.user.uid) {
      return false;
    }
    return isAdminUID(userState.user.uid);
  },
});
