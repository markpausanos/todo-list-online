"use client";

import CreateTask from "@/components/todo/create-task";
import { Button } from "@/components/ui/button";
import { Task } from "@/types/task";
import { Eye, EyeOff, FolderPlus, Plus } from "lucide-react";
import { ClipLoader } from "react-spinners";
import TaskCard from "@/components/todo/task-card";
import { usePathname, useRouter } from "next/navigation";
import { useTaskStore } from "@/stores/task-store";
import { useTasks } from "@/hooks";
import useUpdateTask from "../../../hooks/tasks/useUpdateTask";

export default function Page() {
  const router = useRouter();
  const pathName = usePathname();
  const { data: tasks, isLoading } = useTasks();
  const toggleTask = useUpdateTask();

  const { setShowOnlyIncomplete, showOnlyIncomplete, showOnlyToday } =
    useTaskStore();

  const today = new Date();
  const filteredTasks = tasks?.filter((task) => {
    if (showOnlyIncomplete && task.completed) return false;
    if (showOnlyToday) {
      const taskDueDate = new Date(task.due_date);
      return (
        taskDueDate.getDate() === today.getDate() &&
        taskDueDate.getMonth() === today.getMonth() &&
        taskDueDate.getFullYear() === today.getFullYear()
      );
    }
    return true;
  });

  const handleOnClickTask = (task: Task) => {
    router.push(`${pathName}/${task.id}`);
  };

  return (
    <>
      <div className="flex w-full flex-row items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">
            {showOnlyToday && "Today"}
            {!showOnlyToday && "Tasks"}
          </h1>
          {showOnlyToday && (
            <p className="text-muted-foreground text-sm">All tasks due today</p>
          )}
        </div>

        <div className="flex flex-row gap-4">
          <Button
            onClick={() => setShowOnlyIncomplete(!showOnlyIncomplete)}
            className="bg-background text-muted-foreground  hover:text-primary hover:bg-primary/20 cursor-pointer"
          >
            {!showOnlyIncomplete ? <Eye /> : <EyeOff />}
            <p className="hidden md:block">
              {!showOnlyIncomplete ? "Hide" : "Show"} Completed
            </p>
          </Button>
          <CreateTask>
            <Button className="bg-primary text-white">
              <Plus />
              <p className="hidden md:block">New Task</p>
            </Button>
          </CreateTask>
        </div>
      </div>
      <div className="mt-8 flex w-full flex-col items-center justify-center">
        {isLoading ? <ClipLoader size={24} color="black" /> : null}
        {!isLoading && filteredTasks?.length === 0 && (
          <div className="mt-8 flex flex-col items-center justify-center gap-4">
            <div className="bg-primary/10 rounded-full p-4">
              <FolderPlus size={48} className="text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold">
              You don&apos;t have any tasks yet
            </h2>
            <p className="text-muted-foreground">
              Create a new task to get started
            </p>
          </div>
        )}

        <div className="flex w-full flex-col gap-4 pb-10">
          {!isLoading &&
            filteredTasks?.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={() =>
                  toggleTask.mutate({
                    taskId: task.id,
                    task: { ...task, completed: !task.completed },
                  })
                }
                onClickTask={handleOnClickTask}
              />
            ))}
        </div>
      </div>
    </>
  );
}
