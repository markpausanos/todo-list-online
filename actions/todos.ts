"use server";

import { Task, TaskCreateUpdate } from "@/types/task";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getTasks(): Promise<Task[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user.id)
    .order("due_date", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

export async function getTask(id: number): Promise<Task> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  return data[0];
}

export async function addTask(task: TaskCreateUpdate): Promise<Task[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("tasks")
    .insert([{ ...task, user_id: user.id }])
    .select();

  if (error) throw new Error(error.message);

  revalidatePath("/");
  return data;
}

export async function updateTask(
  id: number,
  updates: TaskCreateUpdate
): Promise<Task[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("tasks")
    .update(updates)
    .match({ id, user_id: user.id }) // Ensure user owns the task
    .select();

  if (error) throw new Error(error.message);

  return data;
}

export async function deleteTask(id: number): Promise<{ success: boolean }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { error } = await supabase
    .from("tasks")
    .delete()
    .match({ id, user_id: user.id }); // Ensure user owns the task

  if (error) throw new Error(error.message);

  revalidatePath("/");
  return { success: true };
}
