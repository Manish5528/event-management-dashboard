"use client";

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { APP_ROUTES } from "@/constants/appRoutes";
import { getLoggedInUser } from "@/hooks/auth";

enum AuthStatus {
  Pending,
  Authenticated,
  Unauthenticated,
}

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function AuthenticatedComponent(props: P) {
    const [authStatus, setAuthStatus] = useState<AuthStatus>(AuthStatus.Pending);
    useEffect(() => {
      const user = getLoggedInUser();
      if (!user) {
        redirect(APP_ROUTES.login)
      } else {
        setAuthStatus(AuthStatus.Authenticated);
      }
    }, []);

    if (authStatus === AuthStatus.Pending) {
      return <div>Loading...</div>; 
    }

    return <WrappedComponent {...props} />;
  };
}
