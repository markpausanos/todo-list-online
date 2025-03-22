import { useQuery } from "@tanstack/react-query";
import { getTasks } from "@/actions/todos";
import { useTaskStore } from "@/stores/task-store";

const useTasks = () => {
  const { setTasks } = useTaskStore();

  return useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const fetchedTasks = await getTasks();
      setTasks(fetchedTasks);
      return fetchedTasks;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export default useTasks;
