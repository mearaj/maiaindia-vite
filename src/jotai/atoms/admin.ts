import { atom } from 'jotai/index';
import { UserProfile } from '@/jotai/data/user';
import { OnlineStatuses } from '@/jotai/data/onlineStatus';

export const isAdminAtom = atom<boolean>(false);
export const adminUsersAtom = atom<UserProfile[]>([]);
export const adminOnlineStatusesAtom = atom<OnlineStatuses>({});
