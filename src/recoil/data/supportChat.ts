import { FieldValue, Timestamp } from '@firebase/firestore';
import { UserProfile } from '@/recoil/data/user';

export interface SupportChatSession {
  id?: string;
  customerID: string;
  status: 'open' | 'closed';
  executiveID: string | null;
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
  messages: SupportChatMessage[];
}

export interface SupportChatUsersSessionsMap {
  [userID: string]: {
    profile: UserProfile;
    sessions: SupportChatSession[];
  };
}

export interface MessageAttachment {
  url: string;
  mimeType: string;
  id: string;
}

export interface SupportChatMessage {
  from: string;
  to: string | null;
  text: string;
  attachments: MessageAttachment[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  id: string;
}
