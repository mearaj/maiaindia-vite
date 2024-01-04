import { atom } from 'recoil';
import { recoilKeys } from '@/recoil/data/recoilKeys';

export interface LiveChatComponentState {
  uiState: 'opened' | 'closed' | 'minimized';
}

export const liveChatComponentAtom = atom<LiveChatComponentState>({
  key: recoilKeys.liveChatComponentAtom,
  default: { uiState: 'closed' },
});
