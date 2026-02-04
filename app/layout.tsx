import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "./components/ThemeProvider";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "FlyPath — Turn Travel Routes into Cinematic Animations",
  description:
    "Create stunning animated travel route videos in your browser. Add destinations, pick a map style, and export cinematic fly-through videos in seconds. Free, no signup.",
  metadataBase: new URL("https://flypath.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "FlyPath — Turn Travel Routes into Cinematic Animations",
    description:
      "Create stunning animated travel route videos in your browser. Add destinations, pick a map style, and export in seconds.",
    url: "https://flypath.app",
    siteName: "FlyPath",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FlyPath — cinematic travel route animation tool",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@praveenyen",
    creator: "@praveenyen",
    title: "FlyPath — Turn Travel Routes into Cinematic Animations",
    description:
      "Create stunning animated travel route videos in your browser. Add destinations, pick a map style, and export in seconds.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('theme')!=='light')document.documentElement.classList.add('dark')}catch(e){}`,
          }}
        />
      </head>
      <body className={`${plusJakarta.variable} antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
