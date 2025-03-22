"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskCreateUpdate } from "@/types/task";
import { MoveLeft, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import TaskForm from "@/components/todo/task-form";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { ClipLoader } from "react-spinners";
import { useDeleteTask, useTask, useUpdateTask } from "@/hooks";
import { use, useEffect } from "react";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { data: task, isLoading } = useTask(Number(id));
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  console.log(task);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskCreateUpdate>({
    defaultValues: {
      title: "",
      description: "",
      due_date: undefined,
      completed: false,
    },
  });

  const handleTaskEdit = (data: TaskCreateUpdate) => {
    if (!task) return;

    const dueDate = new Date(data.due_date);
    data.due_date = new Date(
      Date.UTC(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate())
    );

    updateTask.mutate(
      {
        taskId: task.id,
        task: {
          title: data.title,
          description: data.description,
          due_date: data.due_date,
          completed: data.completed,
        },
      },
      {
        onSuccess: () => {
          toast.success("Task updated successfully.");
          router.replace("/tasks");
          reset();
        },
      }
    );
  };

  const handleDelete = async () => {
    if (!task) return;

    deleteTask.mutate(task.id, {
      onSuccess: () => {
        toast.success("Task deleted successfully.");
        router.replace("/tasks");
        reset();
      },
    });
  };

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description,
        due_date: task.due_date,
        completed: task.completed,
      });
    }
  }, [task, reset]);

  if (!task) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <ClipLoader />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-10">
      <div className="flex w-full flex-row justify-between">
        <Button
          onClick={() => router.back()}
          className="bg-background hover:bg-primary/20 cursor-pointer shadow-none"
        >
          <MoveLeft className="text-foreground" />
        </Button>
        <Button
          onClick={handleDelete}
          className="bg-background hover:bg-destructive/20 cursor-pointer shadow-none"
        >
          <Trash className="text-destructive" />
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Edit Task</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskForm
            control={control}
            errors={errors}
            handleSubmit={handleSubmit}
            onSubmit={handleTaskEdit}
            isLoading={isLoading}
            submitText="Save Changes"
          />
        </CardContent>
      </Card>
    </div>
  );
}
