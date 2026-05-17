import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Paulwie Studio | 无界空间留学工作室",
  description: "重塑你的学术与人生轨迹"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
