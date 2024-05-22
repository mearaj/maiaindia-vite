import { atom } from 'jotai';
import { SupportChatSession } from '@/jotai/data/supportChat';

export const currentUserLiveChatMaximizedAtom = atom<boolean>(false);

export const currentUserLastActiveChatSessionAtom =
  atom<SupportChatSession | null>(null);

export const adminSupportChatSessions = atom<SupportChatSession[]>([]);
export const adminActiveChatSessionAtom = atom<SupportChatSession | null>(null);
