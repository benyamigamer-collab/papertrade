import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "B.K Mine",
  description: "باشگاه مشتریان B.K Mine",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
