import type { Metadata } from "next";
import "./globals.css";
import { AttendanceProvider } from "@/contexts/AttendanceContext";

export const metadata: Metadata = {
  title: "Employee Attendance - User Panel",
  description: "AI-powered photo-based employee attendance system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AttendanceProvider>
          {children}
        </AttendanceProvider>
      </body>
    </html>
  );
}

