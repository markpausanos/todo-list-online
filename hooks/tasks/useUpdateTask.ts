import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTask } from "@/actions/todos";
import { TaskCreateUpdate, Task } from "../../types/task";
import { toast } from "sonner";

const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId,
      task,
    }: {
      taskId: number;
      task: TaskCreateUpdate;
    }) => await updateTask(taskId, task),

    onMutate: async ({
      taskId,
      task,
    }: {
      taskId: number;
      task: TaskCreateUpdate;
    }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      const previousTasks = queryClient.getQueryData(["tasks"]);

      queryClient.setQueryData(["tasks"], (oldTasks: Task[] = []) =>
        oldTasks.map((t) =>
          t.id === taskId ? { ...t, completed: task.completed } : t
        )
      );

      return { previousTasks };
    },

    onError: (error, __, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks);
      }

      toast.error(error.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export default useUpdateTask;
