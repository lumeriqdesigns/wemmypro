import type { Metadata } from "next";
import "./globals.css";
import "./marketing.css";

export const metadata: Metadata = {
  title: {
    default: "WemmyPro World",
    template: "%s · WemmyPro World",
  },
  description:
    "Lagos studio for photography, cinematography, media gear, client galleries and creative training.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
