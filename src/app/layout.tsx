import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jahadeep Sundar S | Portfolio – Tech Enthusiast & Developer",
  description:
    "Portfolio of Jahadeep Sundar S – MCA student, recent BCA graduate, Python & MySQL developer, and Data Analytics Intern at VDart.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
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
