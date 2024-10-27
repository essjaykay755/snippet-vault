"use client";

import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import SignIn from "./SignIn";

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  // const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (loading || !isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return <SignIn />;
  }

  return <>{children}</>;
}
