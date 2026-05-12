import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "浄化迷宮ネフロニア",
  description: "薬理学ビジュアルノベル — 利尿薬の作用機序を物語で学ぶ",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
