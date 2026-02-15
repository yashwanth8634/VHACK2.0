import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VHACK 2.0 | 24-Hour Hackathon by VITS Hyderabad",
  description:
    "VHACK 2.0 - A 24-hour hackathon organized by Vignan Institute of Technology and Science, Hyderabad. Domains: Agentic AI, Cybersecurity & Fintech, Blockchain/Web3/IoT. ₹50,000 Prize Pool.",
  keywords: [
    "hackathon",
    "VITS",
    "VHACK",
    "AI",
    "cybersecurity",
    "blockchain",
    "Hyderabad",
  ],
  openGraph: {
    title: "VHACK 2.0 | 24-Hour Hackathon",
    description:
      "A 24-hour hackathon by VITS Hyderabad. ₹50,000 Prize Pool. Feb 27-28, 2026.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="https://fonts.cdnfonts.com" />
        <link rel="dns-prefetch" href="https://vignanits.ac.in" />
        <link rel="dns-prefetch" href="https://api.qrserver.com" />
        <link
          rel="preconnect"
          href="https://fonts.cdnfonts.com"
          crossOrigin="anonymous"
        />

        {/* Font — preload for fast rendering */}
        <link
          rel="preload"
          href="https://fonts.cdnfonts.com/css/gilroy-bold"
          as="style"
        />
        <link
          href="https://fonts.cdnfonts.com/css/gilroy-bold"
          rel="stylesheet"
        />
      </head>
      <body className="font-[Gilroy-Regular] antialiased">
        <div className="bg-grid" aria-hidden="true" />
        <div className="noise-overlay" aria-hidden="true" />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
