import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "create-fs-app - One command. Production-ready codebase.",
  description: "Build production-ready full-stack monorepo applications. Choose your stack, clone from Git, and start shipping. Built for serious developers who want to start right, not start over.",
  keywords: ["cli", "typescript", "full-stack", "monorepo", "turborepo", "nextjs", "nestjs", "react", "express", "production-ready"],
  authors: [{ name: "create-fs-app community" }],
  openGraph: {
    title: "create-fs-app - One command. Production-ready codebase.",
    description: "Built for serious developers who want to start right, not start over.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={jetbrainsMono.className}>{children}</body>
    </html>
  );
}
