import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 dark:from-black dark:to-gray-900 p-6 w-full max-w-4xl mx-auto">
      <div className="text-center mb-6">
      <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
        Weather Dashboard
      </h1>
      <p className="text-gray-600 dark:text-gray-400 text-sm">
        Stay updated with weather insights
      </p>
      </div>
      {children}
    </div>
  );
}
