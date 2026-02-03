import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Felys",
  description: "The online Felys playground",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-neutral-900 text-neutral-100">
      <body className="antialiased">{children}</body>
    </html>
  );
}
