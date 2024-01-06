import { FieldValue, Timestamp } from '@firebase/firestore';
import { UserProfile } from '@/recoil/data/user';

export interface SupportChatNoID {
  createdAt: FieldValue;
  createdBy: string;
  createdFor: string;
  updatedAt: FieldValue;
  queryLimit?: number; // to be used only by frontend
}

export interface SupportChat extends SupportChatNoID {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface SupportChatSession {
  id?: string;
  customerID: string;
  status: 'open' | 'closed';
  executiveID: string | null;
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
}

export interface SupportChatUsersSessionsMap {
  [userID: string]: {
    profile: UserProfile;
    sessions: SupportChatSession[];
  };
}
