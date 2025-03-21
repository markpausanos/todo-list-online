"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/actions/users";
import { BeatLoader } from "react-spinners";

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
          router.replace("/login"); // Redirect if not logged in
        }
      } catch (error) {
        console.error("Auth check failed", error);
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading)
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center">
        <BeatLoader className="text-" />
      </div>
    );

  return <>{children}</>;
}
