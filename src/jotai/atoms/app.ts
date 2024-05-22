import { OnlineStatus } from '@/jotai/data/onlineStatus';
import { atom } from 'jotai';

export const appOnlineStatusAtom = atom<OnlineStatus>({
  online: false,
  updatedAt: undefined,
});
