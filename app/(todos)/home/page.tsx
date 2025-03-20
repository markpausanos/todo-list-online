"use client";

import { logout } from "@/actions/users";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LogOut } from "lucide-react";

export default function Page() {
  const handleSignOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-svh flex w-full flex-col">
      <div className="flex w-full items-center justify-between px-6 py-4 md:px-20 lg:px-44">
        <h1 className="font-bold">Essence</h1>
        <Button
          onClick={handleSignOut}
          className="bg-background text-muted-foreground hover:text-primary hover:bg-primary/20 cursor-pointer"
        >
          <LogOut />
          <p className="hidden md:block ">Sign Out</p>
        </Button>
      </div>
      <Separator />
    </div>
  );
}
