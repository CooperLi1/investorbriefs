import { useSession } from "next-auth/react"

export default function getUsername() {
  const { data: session, status } = useSession()

  if (status === "authenticated") {
    return session.user.email;
  }

  return 'Signed Out'
}

