'use server';

import { Task, TaskCreate, TaskUpdate } from '@/types/task';
import { createClient } from '@/utils/supabase/client';

export async function getTasks(): Promise<Task[]> {
	const supabase = createClient();
	const { data, error } = await supabase.from('tasks').select('*');
	if (error) throw new Error(error.message);
	return data;
}

export async function addTask(task: TaskCreate): Promise<Task[]> {
	const supabase = createClient();
	const { data, error } = await supabase.from('tasks').insert([task]).select();
	if (error) throw new Error(error.message);
	return data;
}

export async function updateTask(
	id: number,
	updates: TaskUpdate
): Promise<Task[]> {
	const supabase = createClient();
	const { data, error } = await supabase
		.from('tasks')
		.update(updates)
		.match({ id })
		.select();
	if (error) throw new Error(error.message);
	return data;
}

export async function deleteTask(id: number): Promise<{ success: boolean }> {
	const supabase = createClient();
	const { error } = await supabase.from('tasks').delete().match({ id });
	if (error) throw new Error(error.message);
	return { success: true };
}
