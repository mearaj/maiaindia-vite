import { atom } from 'jotai';
import { SupportChatSession } from '@/jotai/data/supportChat';

export const liveChatMaximizedAtom = atom<boolean>(false);

export const userToAdminChatSessionAtom = atom<SupportChatSession | null>(null);

export const adminSupportChatSessionsAtom = atom<SupportChatSession[]>([]);
export const adminActiveChatSessionAtom = atom<SupportChatSession | null>(null);
