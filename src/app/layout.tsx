import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import { BRAND } from "@/components/marketing/brand-logo";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: BRAND.name,
    template: `%s | ${BRAND.name}`,
  },
  description:
    "Software development & digital solutions — IT, Charity, Translator",
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }],
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: BRAND.name,
    description:
      "Software development & digital solutions — IT, Charity, Translator",
    images: [
      {
        url: BRAND.logoOnLight,
        alt: BRAND.name,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Set tema marketing sebelum hydration agar tidak flash
  const themeInitScript = `(function(){try{var t=localStorage.getItem("marketing-theme");if(t==="light"||(t!=="dark"&&window.matchMedia("(prefers-color-scheme: light)").matches)){document.documentElement.classList.add("marketing-light")}}catch(e){}})()`;

  return (
    <html
      lang="id"
      className={`${plusJakartaSans.variable} ${geistMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full font-sans antialiased">
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {children}
      </body>
    </html>
  );
}
