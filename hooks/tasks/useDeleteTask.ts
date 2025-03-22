import { deleteTask } from "@/actions/todos";
import { useTaskStore } from "@/stores/task-store";
import { Task } from "@/types/task";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useDeleteTask = () => {
  const queryClient = useQueryClient();
  const { tasks, setTasks } = useTaskStore();

  return useMutation({
    mutationFn: async (id: number) => await deleteTask(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      const updatedTasks = (tasks as Task[]).filter((t) => t.id !== id);

      setTasks(updatedTasks);

      queryClient.setQueryData<Task[]>(["tasks"], (oldTasks: Task[] = []) =>
        oldTasks.filter((t) => t.id !== id)
      );

      return { previousTasks: queryClient.getQueryData<Task[]>(["tasks"]) };
    },

    onError: (_, __, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks);
        setTasks(context.previousTasks);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export default useDeleteTask;
