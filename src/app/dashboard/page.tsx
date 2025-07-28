"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { APP_ROUTES } from "@/utils/route";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push(APP_ROUTES.login);
    }
  }, [user, router]);

  if (!user) return null; 

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome, {user.username}! 🎉</h1>

      <button onClick={logout} style={styles.logoutBtn}>
        Logout
      </button>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: { display: "flex", flexDirection: "column", alignItems: "center", marginTop: "50px" },
  title: { fontSize: "28px", marginBottom: "20px" },
  logoutBtn: { padding: "10px 20px", background: "red", color: "white", border: "none", cursor: "pointer" },
};
