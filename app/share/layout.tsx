import "@/app/globals.css";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "katex/dist/katex.min.css";

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Shared Conversation | Relearn AI",
  description: "View a shared conversation from Relearn AI",
};

export default function SharedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geist.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-white dark:bg-black">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
