import { useQuery } from "@tanstack/react-query";
import { getTasks } from "@/actions/todos";
import { useTaskStore } from "@/stores/task-store";

const useTasks = () => {
  const { tasks, setTasks, isLoaded, setIsLoaded } = useTaskStore();

  return useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      if (isLoaded) return tasks;

      const fetchedTasks = await getTasks();
      setTasks(fetchedTasks);
      setIsLoaded(true);
      return fetchedTasks;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export default useTasks;
