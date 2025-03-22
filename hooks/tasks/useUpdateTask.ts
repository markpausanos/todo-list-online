import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTask } from "@/actions/todos";
import { TaskCreateUpdate, Task } from "../../types/task";
import { useTaskStore } from "@/stores/task-store";

const useUpdateTask = () => {
  const queryClient = useQueryClient();
  const { setTasks } = useTaskStore();

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

      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);

      const updatedTasks = (previousTasks as Task[]).map((t) =>
        t.id === taskId ? { ...t, ...task } : t
      );

      setTasks(updatedTasks);

      queryClient.setQueryData(["tasks"], (oldTasks: Task[] = []) =>
        oldTasks.map((t) =>
          t.id === taskId ? { ...t, completed: task.completed } : t
        )
      );

      return { previousTasks };
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

export default useUpdateTask;
