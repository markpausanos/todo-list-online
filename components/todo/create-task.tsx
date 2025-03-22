import { ReactNode, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import { toast } from "sonner";
import TaskForm from "./task-form";
import { TaskCreateUpdate } from "@/types/task";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAddTask } from "@/hooks";

type Props = {
  children?: ReactNode;
};
const taskSchema = z.object({
  title: z.string().nonempty({ message: "Title cannot be empty" }),
  description: z.string().optional(),
  due_date: z.date(),
  completed: z.boolean(),
});

export type TaskCreate = z.infer<typeof taskSchema>;

export default function CreateTask({ children }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const addTask = useAddTask();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskCreate>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      due_date: new Date(),
      completed: false,
    },
  });

  const handleTaskSubmit = async (data: TaskCreateUpdate) => {
    // Convert date to UTC (ensure consistency)
    const utcDate = new Date(
      Date.UTC(
        data.due_date.getFullYear(),
        data.due_date.getMonth(),
        data.due_date.getDate()
      )
    );
    data.due_date = utcDate;

    addTask.mutate(data);
    setIsDialogOpen(false);
    reset();
    toast.success("Task added successfully.");
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Create a new task
          </DialogTitle>
        </DialogHeader>

        <TaskForm
          control={control}
          handleSubmit={handleSubmit}
          errors={errors}
          onSubmit={handleTaskSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
