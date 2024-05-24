import { atom } from 'jotai/index';
import { BackendUser, UserProfile } from '@/jotai/data/user';

export const isAdminAtom = atom<boolean>(false);

export const allAdminsForUserAtom = atom<{ [adminID: string]: UserProfile }>(
  {}
);
export const allUsersForAdminAtom = atom<{ [userID: string]: BackendUser }>({});
