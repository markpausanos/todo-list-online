import { create } from "zustand";

type TaskStore = {
  showOnlyToday: boolean;
  showOnlyIncomplete: boolean;
  setShowOnlyToday: (showOnlyToday: boolean) => void;
  setShowOnlyIncomplete: (showOnlyCompleted: boolean) => void;
};

export const useTaskStore = create<TaskStore>((set) => ({
  showOnlyToday: false,
  setShowOnlyToday: (showOnlyToday) => set({ showOnlyToday }),
  showOnlyIncomplete: false,
  setShowOnlyIncomplete: (showOnlyIncomplete) =>
    set({ showOnlyIncomplete: showOnlyIncomplete }),
}));
