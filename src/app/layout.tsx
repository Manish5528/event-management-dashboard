import { Toaster } from "react-hot-toast";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "Event Management Dashboard",
  description: "Manage events with authentication",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
          <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  );
}
