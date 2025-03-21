import { ReactNode, useState } from "react";
import { addTask } from "@/actions/todos";
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

type Props = {
  onTaskCreated?: (data?: TaskCreateUpdate) => void;
  children?: ReactNode;
};
const taskSchema = z.object({
  title: z.string().nonempty({ message: "Title cannot be empty" }),
  description: z.string().optional(),
  due_date: z.date(),
  completed: z.boolean(),
});

export type TaskCreate = z.infer<typeof taskSchema>;

export default function CreateTask({ onTaskCreated, children }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
    const utcDate = new Date(
      Date.UTC(
        data.due_date.getFullYear(),
        data.due_date.getMonth(),
        data.due_date.getDate()
      )
    );
    data.due_date = utcDate;

    setIsLoading(true);

    try {
      await addTask(data);
      setIsDialogOpen(false);
      setIsLoading(false);
      onTaskCreated?.();
      reset();
      toast.success("Task added successfully.");
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again later.");
    }
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
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
