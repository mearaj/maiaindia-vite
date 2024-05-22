import { Timestamp } from '@firebase/firestore';

export interface OnlineStatus {
  online: boolean;
  updatedAt?: Timestamp;
}

export interface OnlineStatuses {
  [key: string]: OnlineStatus;
}
