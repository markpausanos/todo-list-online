import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addTask } from "@/actions/todos";
import { Task, TaskCreateUpdate } from "@/types/task";
import { toast } from "sonner";
import { useTaskStore } from "@/stores/task-store";

const useAddTask = () => {
  const queryClient = useQueryClient();
  const { tasks, setTasks } = useTaskStore();

  return useMutation({
    mutationFn: async (newTask: TaskCreateUpdate) => await addTask(newTask),
    onMutate: async (newTask) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]) || [];
      const optimisticTask = { ...newTask, id: Date.now() };

      setTasks([optimisticTask, ...tasks]);

      queryClient.setQueryData<Task[]>(["tasks"], (oldTasks = []) => [
        optimisticTask,
        ...oldTasks,
      ]);

      return { previousTasks, optimisticTask };
    },
    onError: (error, __, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks);
        setTasks([...context.previousTasks]);
      }
      toast.error(error.message);
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onSuccess: (savedTask, __, context) => {
      if (!context?.optimisticTask) return;

      const updatedTasks: Task[] = tasks.map((task) =>
        task.id === context.optimisticTask.id ? savedTask : task
      );

      setTasks([...updatedTasks]);

      // Replace it in React Query cache
      queryClient.setQueryData<Task[]>(["tasks"], (oldTasks = []) =>
        oldTasks.map(
          (task): Task =>
            task.id === context.optimisticTask.id ? savedTask : task
        )
      );
    },
  });
};

export default useAddTask;
