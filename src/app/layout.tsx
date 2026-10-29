import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { getProfile } from "@/lib/data";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const name = profile?.full_name ?? "Mouhamed Rassoul Niang";
  const title = profile?.title ?? "Développeur Full-Stack";
  const description =
    profile?.bio?.split("\n").filter(Boolean)[0] ??
    `Portfolio de ${name}, ${title.toLowerCase()}.`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return {
    metadataBase: new URL(siteUrl),
    title: { default: `${name} — ${title}`, template: `%s · ${name}` },
    description,
    openGraph: {
      type: "website",
      locale: "fr_FR",
      siteName: name,
      title: `${name} — ${title}`,
      description,
      url: siteUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} — ${title}`,
      description,
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
