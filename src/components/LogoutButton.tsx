'use client';

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="px-4 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md"
    >
      Logout
    </button>
  );
}
