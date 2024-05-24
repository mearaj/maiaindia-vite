import { atom } from 'jotai/index';
import { UserProfile } from '@/jotai/data/user';

export const isAdminAtom = atom<boolean>(false);
export const adminUsersAtom = atom<UserProfile[]>([]);
