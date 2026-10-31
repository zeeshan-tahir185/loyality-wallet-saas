import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const display = Instrument_Serif({ variable: "--font-display", subsets: ["latin"], weight: "400", style: ["normal", "italic"] });

export const metadata: Metadata = {
  title: "LoopWallet | Tarjetas de fidelidad para Apple Wallet y Google Wallet",
  description:
    "Lanza tu tarjeta de sellos o puntos en minutos. Tus clientes la guardan en Apple Wallet o Google Wallet, suman sellos con un QR y vuelven más a menudo.",
};

export const viewport: Viewport = { themeColor: "#0c0c10" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} ${display.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
