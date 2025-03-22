export type Task = {
  id: number;
  title: string;
  description?: string;
  due_date: Date;
  completed: boolean;
};

export type TaskCreateUpdate = Omit<Task, "id">;
