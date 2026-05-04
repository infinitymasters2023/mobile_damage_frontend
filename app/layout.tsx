"use client";

import "./globals.css";
import { SessionProvider } from "next-auth/react";
import Sidebar from "@/components/layout/Sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          {/* Example Layout */}
          <div style={{ display: "flex" }}>
            <main style={{ flex: 1 }}>{children}</main>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}