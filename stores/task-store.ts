import { Task } from "@/types/task";
import { create } from "zustand";

type TaskStore = {
  isLoaded: boolean;
  tasks: Task[];
  showOnlyToday: boolean;
  showOnlyIncomplete: boolean;
  setTasks: (tasks: Task[]) => void;
  setIsLoaded: (isLoaded: boolean) => void;
  setShowOnlyToday: (showOnlyToday: boolean) => void;
  setShowOnlyIncomplete: (showOnlyIncomplete: boolean) => void;
};

const loadLocalState = <T>(key: string, defaultValue: T): T => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  }
  return defaultValue;
};

export const useTaskStore = create<TaskStore>((set) => ({
  isLoaded: loadLocalState("isLoaded", false),
  setIsLoaded: (isLoaded) => {
    localStorage.setItem("isLoaded", JSON.stringify(isLoaded));
    set({ isLoaded });
  },
  tasks: loadLocalState("tasks", []),
  setTasks: (tasks) => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    set({ tasks });
  },
  showOnlyToday: loadLocalState("showOnlyToday", false),
  setShowOnlyToday: (showOnlyToday) => {
    localStorage.setItem("showOnlyToday", JSON.stringify(showOnlyToday));
    set({ showOnlyToday });
  },

  showOnlyIncomplete: loadLocalState("showOnlyIncomplete", false),
  setShowOnlyIncomplete: (showOnlyIncomplete) => {
    localStorage.setItem(
      "showOnlyIncomplete",
      JSON.stringify(showOnlyIncomplete)
    );
    set({ showOnlyIncomplete });
  },
}));
