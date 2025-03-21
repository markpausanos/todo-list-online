"use client";

import { getUser } from "@/actions/users";
import { LoginForm } from "@/components/auth/login-form";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getUser();
        if (user && user.user) {
          router.replace("/tasks");
        }
      } catch (error) {
        console.error("Auth check failed", error);
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="min-h-svh flex w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
