import type { Metadata, Viewport } from "next";
import { INTRO_PLAYED_KEY } from "@/components/introStorage";
import "./globals.css";
import "./motion.css";

// Runs before first paint: if the intro already played this session, flag <html>
// so CSS hides the splash and shows the page immediately (no flash on reload)
const introPlayedScript = `try{if(sessionStorage.getItem(${JSON.stringify(
  INTRO_PLAYED_KEY
)})==="1")document.documentElement.setAttribute("data-intro-played","")}catch(e){}`;

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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* text/plain on the client keeps React from warning about rendering a script tag */}
        <script
          type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: introPlayedScript }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
