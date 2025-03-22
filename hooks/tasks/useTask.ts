import { useQuery } from "@tanstack/react-query";
import { getTask } from "@/actions/todos";
import { Task } from "@/types/task";
import { useTaskStore } from "@/stores/task-store";

const useTask = (id: number) => {
  const { tasks } = useTaskStore();
  return useQuery<Task>({
    queryKey: ["task", id],
    queryFn: () => {
      const task = tasks.find((task) => task.id === id);

      if (task) return task;

      const fetchedTask = getTask(id);

      return fetchedTask;
    },
    enabled: !!id,
  });
};

export default useTask;
