import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "CNN Gender Classifier Workspace",
  description:
    "Workspace de métricas, pipeline e inferencia productiva para el clasificador CNN de género.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
