"use client";
import { Card, CardHeader, CardFooter, Button, addToast } from "@heroui/react";
import { View, Trash, ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { redirect } from "next/dist/server/api-utils";

function Facturas() {
  const [facturas, setFacturas] = useState([]);
  useEffect(() => {
    const fetchFacturas = async () => {
      try {
        const response = await fetch(`/api/v1/facturas`);
        if (!response.ok) {
          redirect("/");
        }
        const result = await response.json();

        if (result.error === "false" && Array.isArray(result.data)) {
          setFacturas(result.data);
        } else {
          throw new Error(result.mensaje || "Formato de datos incorrecto");
        }
      } catch (err) {
        redirect("/");
      }
    };

    fetchFacturas();
  }, []);

  const deleteFactura = async (id) => {
    try {
      const response = await fetch(`/api/v1/facturas/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result.error === "false") {
        addToast({
          title: "Notificación",
          variant: "flat",
          color: "success",
          description: "Factura Eliminada con exito",
        });
        setFacturas((prevFacturas) =>
          prevFacturas.filter((factura) => factura.id !== id)
        );
      } else {
        addToast({
          title: "Notificación",
          variant: "flat",
          color: "warning",
          description: "Error al eliminar factura: " + result.mensaje,
        });
      }
    } catch (err) {
      addToast({
        title: "Notificación",
        variant: "flat",
        color: "warning",
        description: "Error al eliminar factura: " + err.message,
      });
    }
  };

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
        {facturas.map((factura) => (
          <Card
            key={factura.id}
            isFooterBlurred
            className="h-[200px] col-span-12 sm:col-span-3"
          >
            <CardHeader className="absolute z-10 top-1 flex-col items-start bg-black/30 px-4 py-2 rounded-md gap-1">
              <p className="text-sm text-white/90 uppercase font-bold">
                {factura.fecha}
              </p>
              <p className="text-sm text-white/90 uppercase font-bold">
                {`ID: ${factura.id}`}
              </p>
              <p className="text-sm text-white/90 uppercase font-bold">
                {`Cliente: ${factura.cliente}`}
              </p>
              <p className="text-sm text-white/90 uppercase font-bold">
                {`Total: $${factura.total}`}
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
                onPress={() => {
                  addToast({
                    title: "Notificación",
                    variant: "flat",
                    description: "Eliminando factura, por favor espera...",
                    promise: deleteFactura(factura.id),
                  });
                }}
              >
                <Trash />
              </Button>
              <Button className="px-0" color="primary" radius="full" size="sm">
                <Link
                  href={`/view/factura/${factura.id}`}
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
