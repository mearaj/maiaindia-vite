import { FieldValue, Timestamp } from '@firebase/firestore';
import { BackendUser } from '@/jotai/data/user';

export interface SupportChatSession {
  id?: string; // required only in frontend
  customer?: BackendUser; // required only in frontend
  customerID: string;
  createdBy: string;
  status: 'open' | 'closed';
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
  messages: SupportChatMessage[];
}

export interface MessageAttachment {
  url: string;
  mimeType: string;
  id: string;
}

export enum MessageState {
  Created,
  ReachedServer,
  ReachedRecipient,
  ReadByRecipient,
}

export interface SupportChatMessage {
  from: string;
  to: string | null;
  text: string;
  attachments: MessageAttachment[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  id: string;
  state: MessageState;
}
