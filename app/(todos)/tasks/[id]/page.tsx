"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskCreateUpdate, Task } from "@/types/task";
import { MoveLeft, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import TaskForm from "@/components/todo/task-form";
import { toast } from "sonner";
import { updateTask, deleteTask, getTask } from "@/actions/todos";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ClipLoader } from "react-spinners";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskCreateUpdate>();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const { id } = await params;
        const data = await getTask(Number(id));
        setTask(data);
        reset({
          title: data.title,
          description: data.description || "",
          due_date: data.due_date,
          completed: data.completed,
        });
      } catch (error) {
        console.error("Failed to load task:", error);
        router.replace("/tasks");
      }
    };

    fetchTask();
  }, [params, reset, router]);

  const handleTaskEdit = async (data: TaskCreateUpdate) => {
    if (!task) return;

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
      await updateTask(task.id, data);
      toast.success("Task updated successfully.");
      router.replace("/tasks");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update task.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!task) return;

    try {
      await deleteTask(task.id);
      toast.success("Task deleted successfully.");
      router.replace("/tasks");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete task.");
    }
  };

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
