"use client";

import { getTasks, updateTask } from "@/actions/todos";
import CreateTask from "@/components/todo/create-task";
import { Button } from "@/components/ui/button";
import { Task } from "@/types/task";
import { Eye, EyeOff, FolderPlus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { AnimatePresence } from "framer-motion";
import TaskCard from "@/components/todo/task-card";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { useTaskStore } from "@/stores/task-store";

export default function Page() {
  const router = useRouter();
  const pathName = usePathname();
  const { setShowOnlyIncomplete, showOnlyIncomplete, showOnlyToday } =
    useTaskStore();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const today = new Date();
  const filteredTasks = tasks.filter((task) => {
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

  const fetchTasks = async () => {
    if (tasks.length === 0) setIsLoading(true);
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (task: Task) => {
    try {
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === task.id ? { ...t, completed: !task.completed } : t
        )
      );

      await updateTask(task.id, { ...task, completed: !task.completed });
      toast.success("Task completed status updated successfully.");
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
      console.error(error);

      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === task.id ? { ...t, completed: task.completed } : t
        )
      );
    }
  };

  const handleOnClickTask = (task: Task) => {
    router.push(`${pathName}/${task.id}`);
  };

  useEffect(() => {
    setIsLoading(true);
    fetchTasks();
  }, [showOnlyIncomplete, showOnlyToday]);

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
          <CreateTask onTaskCreated={fetchTasks}>
            <Button className="bg-primary text-white">
              <Plus />
              <p className="hidden md:block">New Task</p>
            </Button>
          </CreateTask>
        </div>
      </div>
      <div className="mt-8 flex w-full flex-col items-center justify-center">
        {isLoading ? <ClipLoader size={24} color="black" /> : null}
        {!isLoading && filteredTasks.length === 0 && (
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
        <AnimatePresence>
          <div className="flex w-full flex-col gap-4 pb-10">
            {!isLoading &&
              filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={handleToggle}
                  onClickTask={handleOnClickTask}
                />
              ))}
          </div>
        </AnimatePresence>
      </div>
    </>
  );
}
