export type Task = {
  id: number;
  title: string;
  description?: string;
  due_date: Date;
  completed: boolean;
  userId: string;
};

export type TaskCreateUpdate = Omit<Task, "id" | "userId">;
