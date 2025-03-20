export type Task = {
    id: number,
    title: string,
    description: string,
    dueDate: Date,
    completed: boolean
}
export type TaskCreate = Omit<Task, 'id' | 'completed'>;
export type TaskUpdate = Partial<Task>;