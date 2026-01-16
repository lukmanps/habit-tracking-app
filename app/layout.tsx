import type { Metadata } from "next";
import { Anek_Latin } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import NotificationManager from "@/components/NotificationManager";

const anekLatin = Anek_Latin({
  subsets: ["latin"],
  variable: "--font-anek-latin",

});

export const metadata: Metadata = {
  title: "Habit Tracker",
  description: "Distraction-free habit tracker",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased ${anekLatin.variable} min-h-screen bg-neutral-50 dark:bg-[var(--background)] text-neutral-900 dark:text-[var(--foreground)] font-sans transition-colors`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <NotificationManager />
          <main className="mx-auto max-w-2xl min-h-screen bg-white dark:bg-neutral-950 relative shadow-2xl shadow-neutral-200/50 dark:shadow-none transition-colors">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
