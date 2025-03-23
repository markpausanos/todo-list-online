import { Controller, useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import DatePicker from "./date-picker";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { TaskCreateUpdate } from "@/types/task";

type TaskFormProps = {
  onSubmit: (data: TaskCreateUpdate) => void;
  handleSubmit: ReturnType<typeof useForm<TaskCreateUpdate>>["handleSubmit"];
  initialValues?: Partial<TaskCreateUpdate>;
  isLoading?: boolean;
  submitText?: string;
  control: ReturnType<typeof useForm<TaskCreateUpdate>>["control"];
  errors: ReturnType<typeof useForm<TaskCreateUpdate>>["formState"]["errors"];
};

export default function TaskForm({
  onSubmit,
  handleSubmit,
  isLoading = false,
  submitText = "Create Task",
  control,
  errors,
}: TaskFormProps) {
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex w-full flex-col gap-y-4">
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <>
              <Input {...field} placeholder="Task title" />
              {errors.title && (
                <span className="text-destructive text-sm">
                  {errors.title.message}
                </span>
              )}
            </>
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Textarea
              className="max-h-36"
              {...field}
              placeholder="Description (optional)"
            />
          )}
        />

        <div className="flex w-full flex-row justify-between">
          <Controller
            name="due_date"
            control={control}
            render={({ field }) => (
              <DatePicker setDate={field.onChange} date={field.value} />
            )}
          />
          <Controller
            name="completed"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col items-center space-x-2 md:flex-row">
                <Checkbox
                  id="completed"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="border-foreground"
                />
                <Label htmlFor="completed" className="text-sm">
                  Mark as completed
                </Label>
              </div>
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="bg-primary text-background cursor-pointer"
        >
          {submitText}
        </Button>
      </div>
    </form>
  );
}
