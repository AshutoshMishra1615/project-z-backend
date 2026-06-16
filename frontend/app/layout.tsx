import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: "Project Z — Elite Developer Terminal",
  description:
    "A high-performance integrated environment for competitive programmers. Millisecond execution, real-time analytics, and uncompromising precision.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="flex flex-col h-screen font-body-md text-body-md selection:bg-primary-container/30 overflow-hidden bg-background">
        <AuthProvider>
          <div className="bg-grid" />
          <Navbar />
          <main className="flex-1 flex overflow-hidden relative z-10 w-full">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
