import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ephemeral Test App",
  description: "PR preview test app with Postgres CRUD",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
