import { Geist, Geist_Mono } from "next/font/google";
import { HeroProvider } from "@/app/(front_ui)/core/providers/HeroProvider";
import "@/module/common/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Facturacion de Negocio",
  description: "App web para facturacion de negocio",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <HeroProvider>
          <div className="w-dvw h-dvh min-w-dvw min-h-dvh md:p-16">
            {children}
          </div>
        </HeroProvider>
      </body>
    </html>
  );
}
