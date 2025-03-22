import { deleteTask } from "@/actions/todos";
import { useTaskStore } from "@/stores/task-store";
import { Task } from "@/types/task";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useDeleteTask = () => {
  const queryClient = useQueryClient();
  const { setTasks } = useTaskStore();

  return useMutation({
    mutationFn: async (id: number) => await deleteTask(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      queryClient.setQueryData<Task[]>(["tasks"], (oldTasks = []) => {
        const updatedTasks = oldTasks.filter((t) => t.id !== id);
        setTasks(updatedTasks);
        return updatedTasks;
      });

      return { previousTasks: queryClient.getQueryData<Task[]>(["tasks"]) };
    },

    onError: (_, __, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks);
        setTasks(context.previousTasks); // Restore UI on error
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export default useDeleteTask;
