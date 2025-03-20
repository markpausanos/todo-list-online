'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '@/actions/users';

export default function AuthProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const user = await getUser();
				if (!user || !user.user) {
					router.replace('/login'); // Redirect if not logged in
				}
			} catch (error) {
				console.error('Auth check failed', error);
				router.replace('/login');
			} finally {
				setLoading(false);
			}
		};

		checkAuth();
	}, []);

	if (loading) return <div>Loading...</div>; 

	return <>{children}</>;
}
