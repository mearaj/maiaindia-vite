export interface ChatUser {
  email: string;
  uid: string;
  displayName: string;
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

const generateAdminUsersFromEnv = (): ChatUser[] => {
  const validAdminUsers: ChatUser[] = [];
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
