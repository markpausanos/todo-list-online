'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LockIcon, MailIcon } from 'lucide-react';
import { useState } from 'react';
import { signup } from '@/actions/users';
import { toast } from 'sonner';
import Link from 'next/link';

const signUpSchema = z.object({
	email: z.string().email({ message: 'Invalid email address' }),
	password: z
		.string()
		.min(8, { message: 'Password must be at least 8 characters long' }),
});

export function SignUpForm({
	className,
	...props
}: React.ComponentPropsWithoutRef<'div'>) {
	const form = useForm<z.infer<typeof signUpSchema>>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(false);

	const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
		setError(null);
		setLoading(true);

		try {
			await signup(data);
			toast.success('Email sent to verify your account');
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Something went wrong');
            toast.error(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={cn('flex flex-col gap-4', className)} {...props}>
			<h1 className="text-2xl font-bold text-center">Create an account</h1>
			<p className="text-center text-sm text-muted-foreground">
				Enter your information to get started with Essence
			</p>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex flex-col gap-4"
				>
					{/* Email Field */}
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input
										icon={<MailIcon size={16} />}
										placeholder="Email"
										type="email"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Password Field */}
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<div className="flex items-center justify-between"></div>
								<FormControl>
									<Input
										icon={<LockIcon size={16} />}
										type="password"
										placeholder="Password"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Submit Button */}
					<Button disabled={loading} type="submit" className="w-full">
						Create Account
					</Button>
				</form>
			</Form>

			<div className="mt-4 text-center text-sm">
				<span className="text-muted-foreground">Already have an account? </span>
				<Link href="login" className="text-accent hover:underline">
					Sign in
				</Link>
			</div>
		</div>
	);
}
