import { Card, CardHeader, Image as Img } from "@heroui/react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-4/6 grid grid-cols-12 gap-4">
        <header className="col-span-12 gap-3 flex flex-col items-start justify-center">
          <h1 className="text-2xl md:text-5xl font-bold">
            Facturación de Negocio
          </h1>
          <h2 className="md:text-2xl opacity-85">UI Frontend</h2>
        </header>
        <main className="col-span-12 flex items-center justify-center">
          <div className="w-full gap-6 grid grid-cols-12 px-2">
            <Card className="col-span-12 md:col-span-6 h-[200px] md:h-[300px] hover:scale-[97%] transition-transform duration-300 active:scale-90 cursor-pointer">
              <Link href="/view/facturas" className="w-full h-full">
                <CardHeader className="absolute z-10 top-1 flex-col items-start!">
                  <p className="md:text-xl text-white/70 uppercase font-medium">
                    Control para emitir una nueva factura
                  </p>
                  <h3 className="text-white font-bold text-lg md:text-2xl">
                    Emitir Factura
                  </h3>
                </CardHeader>
                <div className="w-full h-full flex items-center justify-center">
                  <Img
                    removeWrapper
                    alt="Card background"
                    className="z-0 w-full h-2/3 object-contain"
                    src="/module/home/assets/icons/ef.png"
                  />
                </div>
              </Link>
            </Card>
            <Card className="col-span-12 md:col-span-6 h-[200px] md:h-[300px] hover:scale-[97%] transition-transform duration-300 active:scale-90 cursor-pointer">
              <Link href="/view/factura/45" className="w-full h-full">
                <CardHeader className="absolute z-10 top-1 flex-col items-start!">
                  <p className="md:text-xl text-white/70 uppercase font-medium">
                    Listado de facturas emitidas
                  </p>
                  <h3 className="text-white font-bold text-lg md:text-2xl">
                    Ver Facturas
                  </h3>
                </CardHeader>
                <div className="w-full h-full flex items-center justify-center">
                  <Img
                    removeWrapper
                    alt="Card background"
                    className="z-0 w-full h-2/3 object-contain"
                    src="/module/home/assets/icons/lf.png"
                  />
                </div>
              </Link>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
