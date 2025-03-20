import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
	const supabase = await createClient();
	const { data, error } = await supabase.auth.signUp({
		email: 'test@example.com',
		password: 'testpassword123',
	});

	console.log('Response:', data); // ✅ Log response
	console.log('Error:', error); // ✅ Log error

	return NextResponse.json({ data, error });
}
