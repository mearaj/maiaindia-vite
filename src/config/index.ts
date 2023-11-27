export interface UserProfile {
  email?: string | null;
  uid: string;
  displayName?: string | null;
  photoURL?: string | null;
}

export const adminUids = import.meta.env.VITE_ADMIN_UIDS.split(',');
export const adminNames = import.meta.env.VITE_ADMIN_NAMES.split(',');
export const adminPhotoURLs = import.meta.env.VITE_ADMIN_PHOTOURLS.split(',');

export const isAdminUID = (uidStr: string | null): boolean => {
  if (!uidStr) {
    return false;
  }
  return adminUids.findIndex((eachUID: string) => eachUID === uidStr) >= 0;
};

const generateAdminUsersFromEnv = (): UserProfile[] => {
  const validAdminUsers: UserProfile[] = [];
  if (adminUids.length < 1) {
    return validAdminUsers;
  }
  if (
    adminNames.length !== adminUids.length ||
    adminPhotoURLs.length !== adminUids.length
  ) {
    return validAdminUsers;
  }
  for (let i = 0; i < adminUids.length; i += 1) {
    validAdminUsers.push({
      uid: adminUids[i],
      displayName: adminNames[i],
      photoURL: adminPhotoURLs[i],
    });
  }
  return validAdminUsers;
};

export const adminUsers = generateAdminUsersFromEnv();
