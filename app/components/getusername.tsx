import { useSession } from "next-auth/react";

export default function getUserName() {
  const { data: session } = useSession();

  if (session && session.user) {
    const username = session.user.name; // Or session.user.username
    return username;
  }

  return 'Not signed in';
}
