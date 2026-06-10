import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: "Project Z — Master the Art of Code",
  description:
    "A competitive programming platform with an IDE-grade editor, async execution engine, and instant verdicts. Solve coding challenges and level up your skills.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="bg-grid" />
          <Navbar />
          <main style={{ paddingTop: 56, position: "relative", zIndex: 10 }}>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
