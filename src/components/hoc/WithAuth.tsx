"use client";

import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { APP_ROUTES } from "@/constants/appRoutes";
import { getLoggedInUser } from "@/hooks/auth";

enum AuthStatus {
  Pending,
  Authenticated,
  Unauthenticated,
}

export default function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function AuthenticatedComponent(props: P) {
    const [authStatus, setAuthStatus] = useState<AuthStatus>(
      AuthStatus.Pending
    );
    const router = useRouter();

    useEffect(() => {
      const user = getLoggedInUser();

      if (!user) {
        setAuthStatus(AuthStatus.Unauthenticated);
        // Using redirect() because auth is in localStorage and no cookies exist for server-side checks.
        // With cookies, we’d use middleware to redirect before render.
        // router.replace() needs a timeout to avoid hydration issues.
        redirect(APP_ROUTES.login);
      } else {
        setAuthStatus(AuthStatus.Authenticated);
      }
    }, [router]);

    if (authStatus === AuthStatus.Pending) {
      return <div>Loading...</div>;
    }

    if (authStatus === AuthStatus.Unauthenticated) {
      return <div>Redirecting to login...</div>;
    }

    return <WrappedComponent {...props} />;
  };
}
