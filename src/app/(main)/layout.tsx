import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import LogoutButton from "@/components/LogoutButton";
import { redirect } from "next/navigation";
import React from "react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <header className="flex flex-col md:flex-row items-center justify-between px-4 md:px-6 py-4 bg-white dark:bg-gray-800 shadow-md gap-4">
        <div className="flex justify-between w-full md:w-auto items-center">
          <h1 className="text-xl md:text-2xl font-bold">🌦️ Weather Dashboard</h1>
        </div>

        <div className="flex flex-col md:flex-row items-center md:gap-4 w-full md:w-auto justify-between md:justify-end gap-2">
          <div className="text-sm text-center md:text-right">
            <p className="font-semibold truncate">{session.user?.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{session.user?.email}</p>
          </div>
          <LogoutButton />
        </div>
      </header>

      <main className="p-4 md:p-6 max-w-7xl mx-auto">{children}</main>
    </div>
  );
}