import { FieldValue, Timestamp } from '@firebase/firestore';
import { UserProfile } from '@/recoil/data/user';

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

export interface MessageAttachmentNoID {
  url: string;
  mimeType: string;
}

export interface MessageAttachment extends MessageAttachmentNoID {
  id: string;
}

export interface SupportChatMessageNoID {
  from: string;
  to: string | null;
  text: string;
  attachments: MessageAttachment[] | MessageAttachmentNoID[] | null;
  createdAt: FieldValue | Timestamp;
  updatedAt: FieldValue | Timestamp;
}

export interface SupportChatMessage extends SupportChatMessageNoID {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
