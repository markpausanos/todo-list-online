import { Task } from "@/types/task";
import { motion } from "framer-motion";
import { Checkbox } from "../ui/checkbox";
import { Badge } from "../ui/badge";
import { Calendar } from "lucide-react";
import { cn } from "../../lib/utils";
import { format } from "date-fns";

type Props = {
  task: Task;
  onToggle: (task: Task) => void;
  onClickTask: (task: Task) => void;
};

export default function TaskCard({ task, onToggle, onClickTask }: Props) {
  const dueDateUTC = new Date(task.due_date); // UTC date from backend

  const isOverdue = dueDateUTC < new Date();

  return (
    <motion.div
      key={task.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="bg-background border-muted group flex w-full flex-row gap-4 rounded-lg border p-4 shadow-md transition-colors hover:shadow-lg"
    >
      <div className="flex flex-col items-center justify-center">
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => onToggle(task)}
          className="group-hover:border-primary cursor-pointer rounded-lg transition-colors"
        />
      </div>
      <div
        onClick={() => onClickTask(task)}
        className="flex w-full cursor-pointer flex-row items-center justify-between"
      >
        <div
          className={cn("flex flex-col items-start", {
            "line-through": task.completed,
          })}
        >
          <h2 className="text-base font-bold">{task.title}</h2>
          {task.description !== "" && (
            <p className="text-muted-foreground text-sm">{task.description}</p>
          )}
        </div>
        <Badge
          className={`flex items-center gap-1 rounded-lg p-1 ${
            isOverdue
              ? "text-destructive/60 bg-destructive/10"
              : "text-primary bg-primary/20"
          }`}
        >
          <Calendar />
          <p className="font-semibold">
            {format(dueDateUTC, "MMM d")} {/* Displays local date */}
          </p>
        </Badge>
      </div>
    </motion.div>
  );
}
