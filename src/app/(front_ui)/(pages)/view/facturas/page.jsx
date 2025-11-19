import { Card, CardHeader, CardFooter, Button } from "@heroui/react";
import { View, Trash, ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const facturas = [
  {
    id: 1,
    cliente: "Juan Pérez",
    fecha: "2025-01-10",
    total: 250.0,
  },
  {
    id: 2,
    cliente: "María Gómez",
    fecha: "2025-01-11",
    total: 480.3,
  },
];

const numbers = new Array(12).fill(0).map((_, i) => i + 1);

function Facturas() {
  return (
    <div className="w-full h-full flex flex-col gap-4 p-6 md:p-0">
      <div className="w-full flex justify-start items-center gap-4">
        <Button color={"primary"} size={"sm"} className="px-0">
          <Link
            href={"/"}
            className="w-full h-full px-2 flex items-center justify-center"
          >
            <ChevronLeft />
          </Link>
        </Button>
        <h2 className="flex-1 flex items-center justify-center bg-foreground-50 rounded p-2 font-bold">
          Facturas Emitidas
        </h2>
      </div>
      <div className="w-full gap-2 grid grid-cols-12 scrollbar-hide overflow-y-scroll">
        {numbers.map((num) => (
          <Card
            key={num}
            isFooterBlurred
            className="h-[200px] col-span-12 sm:col-span-3"
          >
            <CardHeader className="absolute z-10 top-1 flex-col items-start bg-black/30 px-4 py-2 rounded-md gap-1">
              <p className="text-sm text-white/90 uppercase font-bold">
                {`2025-01-11`}
              </p>
              <p className="text-sm text-white/90 uppercase font-bold">
                {`ID: 2`}
              </p>
              <p className="text-sm text-white/90 uppercase font-bold">
                {`Cliente: María Gómez`}
              </p>
              <p className="text-sm text-white/90 uppercase font-bold">
                {`Total: $480.30`}
              </p>
            </CardHeader>
            <div className="w-full h-full flex items-center justify-center">
              <div className="h-2/3">
                <Image
                  alt="Card background"
                  className="z-0 w-full h-full object-contain"
                  src="/module/view/facturas/assets/icons/f.png"
                  width={500}
                  height={500}
                />
              </div>
            </div>
            <CardFooter className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-end gap-2">
              <Button
                className="text-tiny"
                color="warning"
                radius="full"
                size="sm"
              >
                <Trash />
              </Button>
              <Button className="px-0" color="primary" radius="full" size="sm">
                <Link
                  href={`/view/factura/${num}`}
                  className="w-full h-full px-2 flex items-center justify-center"
                >
                  <View />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Facturas;
