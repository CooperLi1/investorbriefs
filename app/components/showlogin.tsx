"use client";

import { useSession } from "next-auth/react";

export function UserProfile() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return <p>Not signed in</p>;
  }

  return (
    <div className="flex items-center space-x-2">
      <img src={session.user?.image || "/default-avatar.png"} alt="User Avatar" className="w-8 h-8 rounded-full" />
      <span>{session.user?.name || "User"}</span>
    </div>
  );
}
