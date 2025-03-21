interface AuthLayoutProps {
  children: React.ReactNode;
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  return <main className="bg-background h-screen w-screen">{children}</main>;
}
