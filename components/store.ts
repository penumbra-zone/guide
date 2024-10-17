import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface QuestState {
  scanSinceBlockHeight: number;
  setScanSinceBlockHeight: (height: number) => void;
}

export const useQuestStore = create<QuestState>()(
  persist(
    (set) => ({
      scanSinceBlockHeight: 0,
      setScanSinceBlockHeight: (height) =>
        set({ scanSinceBlockHeight: height }),
    }),
    {
      name: 'quest-storage',
    },
  ),
);
