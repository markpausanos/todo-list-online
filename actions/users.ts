'use server';

import { createClient } from '@/utils/supabase/server';
import { UserLoginSignup } from '@/types/user';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function login(user: UserLoginSignup) {
	const supabase = await createClient();
	const { error } = await supabase.auth.signInWithPassword({
		email: user.email,
		password: user.password,
	});

	if (error) {
		throw new Error(error.message);
	}
}

export async function signup(user: UserLoginSignup) {
	const supabase = await createClient();
	console.log('user', user);
	const { data, error } = await supabase.auth.signUp({
		email: user.email,
		password: user.password,
	});

	console.log('Response:', data); // ✅ Log response
	console.log('Error:', error); // ✅ Log error

	if (error) {
		redirect('/error');
	}

	revalidatePath('/', 'layout');
	redirect('/');
}

export async function getUser() {
	const supabase = await createClient();
	const { data, error } = await supabase.auth.getUser();

	if (error) {
		throw new Error(error.message);
	}

	return data;
}

export async function logout() {
	const supabase = await createClient();
	const { error } = await supabase.auth.signOut();

	if (error) {
		throw new Error(error.message);
	}

	redirect('/login');
}
