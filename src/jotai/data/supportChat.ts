import { FieldValue, Timestamp } from '@firebase/firestore';
import { UserProfile } from '@/jotai/data/user';

export interface SupportChatSession {
  id?: string; // required only in frontend
  customerProfile?: UserProfile; // required only in frontend
  executiveProfile?: UserProfile; // required only in frontend
  customerID: string;
  status: 'open' | 'closed';
  executiveID: string | null;
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
  messages: SupportChatMessage[];
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
