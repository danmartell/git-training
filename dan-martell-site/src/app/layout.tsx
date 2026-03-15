import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dan Martell — Buy Back Your Time",
  description:
    "Founder of SaaS Academy, author of Buy Back Your Time, angel investor. Helping SaaS founders scale to exit.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
