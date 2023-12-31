import { FieldValue, Timestamp } from '@firebase/firestore';

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
