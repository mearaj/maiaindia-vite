export interface UserProfile {
  email?: string | null;
  uid: string;
  displayName?: string | null;
  photoURL?: string | null;
}

export const adminEmails = import.meta.env.VITE_ADMIN_EMAILS.split(
  ','
) as string[];
export const adminUids = import.meta.env.VITE_ADMIN_UIDS.split(',');
export const adminNames = import.meta.env.VITE_ADMIN_NAMES.split(',');

export const isAdminEmail = (email: string | null): boolean => {
  if (!email) {
    return false;
  }
  return adminEmails.findIndex((eachEmail: string) => eachEmail === email) >= 0;
};

export const isAdminUID = (uidStr: string | null): boolean => {
  if (!uidStr) {
    return false;
  }
  return adminUids.findIndex((eachUID: string) => eachUID === uidStr) >= 0;
};

const generateAdminUsersFromEnv = (): UserProfile[] => {
  const validAdminUsers: UserProfile[] = [];
  if (adminEmails.length < 1) {
    return validAdminUsers;
  }
  if (
    adminEmails.length !== adminUids.length ||
    adminEmails.length !== adminNames.length
  ) {
    return validAdminUsers;
  }
  for (let i = 0; i < adminEmails.length; i += 1) {
    validAdminUsers.push({
      uid: adminUids[i],
      displayName: adminNames[i],
      email: adminEmails[i],
    });
  }
  return validAdminUsers;
};

export const adminUsers = generateAdminUsersFromEnv();
