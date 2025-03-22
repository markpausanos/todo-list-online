"use client";

import { logout } from "@/actions/users";
import Providers from "@/components/providers/provider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import { useTaskStore } from "@/stores/task-store";

import { CalendarCheck, LogOut, SquareCheckBig } from "lucide-react";
import { useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { showOnlyToday, setShowOnlyToday } = useTaskStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await logout();
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Providers>
      <div className="min-h-svh flex w-full flex-col items-center">
        <div className="flex w-full items-center justify-between px-6 py-4 md:px-20 lg:px-44">
          <h1 className="font-bold">Essence</h1>
          <div className="flex flex-row items-center gap-4">
            <Toggle
              pressed={!showOnlyToday}
              className="text-muted-foreground data-[state=on]:bg-primary/20 data-[state=on]:text-primary"
              onPressedChange={() => setShowOnlyToday(!showOnlyToday)}
            >
              <SquareCheckBig />
              <p className="hidden md:block">Tasks</p>
            </Toggle>
            <Toggle
              pressed={showOnlyToday}
              className="text-muted-foreground data-[state=on]:bg-primary/20 data-[state=on]:text-primary"
              onPressedChange={() => setShowOnlyToday(!showOnlyToday)}
            >
              <CalendarCheck />
              <p className="hidden md:block">Today</p>
            </Toggle>
            <Button
              disabled={isLoading}
              onClick={handleSignOut}
              className="bg-background text-muted-foreground hover:text-destructive hover:bg-destructive/20 cursor-pointer shadow-none"
            >
              <LogOut />

              <p className="hidden md:block">Sign Out</p>
            </Button>
          </div>
        </div>
        <Separator className="mb-10" />

        <div className="flex w-full max-w-3xl flex-col items-center justify-center px-10">
          {children}
        </div>
      </div>
    </Providers>
  );
}
