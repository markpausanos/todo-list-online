interface AuthLayoutProps {
	children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
	return <main className="h-screen w-screen bg-background">{children}</main>;
}
