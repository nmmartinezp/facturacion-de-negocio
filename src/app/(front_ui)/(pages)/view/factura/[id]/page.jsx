"use client";
import { Form, Input, Button, DateInput, Divider } from "@heroui/react";
import { parseDate } from "@internationalized/date";
import Link from "next/link";
import { User, Calendar, Box, Coins, ChevronLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { redirect } from "next/dist/server/api-utils";

function Factura({ params }) {
  const [facuraData, setFactura] = useState({});

  useEffect(() => {
    const fetchFactura = async () => {
      try {
        const { id } = await params;
        const response = await fetch(`/api/v1/facturas/${id}`);
        if (!response.ok) {
          redirect("/");
        }
        const result = await response.json();
        if (result.error === "false") {
          setFactura((prev) => ({ ...prev, ...result.data }));
        } else {
          throw new Error(result.mensaje || "Formato de datos incorrecto");
        }
      } catch (err) {
        redirect("/");
      }
    };

    fetchFactura();
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center p-6 md:p-0">
      <Form className="w-full h-full gap-14 md:gap-0 flex flex-col">
        <section className="w-full md:h-[83%] flex flex-col md:flex-row gap-14">
          <div className="md:w-96 h-auto md:h-full flex flex-col gap-4">
            <div className="w-full flex items-center justify-center bg-foreground-50 rounded p-2 font-bold">
              Datos de la Factura
            </div>
            <Input
              isReadOnly
              label="Cliente"
              labelPlacement="outside"
              name="cliente"
              placeholder="Nombre del cliente"
              value={facuraData.cliente ? facuraData.cliente : ""}
              startContent={<User />}
              type="text"
            />
            <DateInput
              isReadOnly
              name="fecha"
              key={"date"}
              label="Fecha de Emisión"
              labelPlacement={"outside"}
              startContent={<Calendar />}
              value={
                facuraData.fecha
                  ? parseDate(facuraData.fecha?.split("T")[0])
                  : undefined
              }
            />
            <Input
              isReadOnly
              startContent={<Coins />}
              label="Total"
              labelPlacement="outside"
              placeholder="0.00"
              value={facuraData.total ? facuraData.total : 0}
              type="number"
            />
            {facuraData && (
              <div className="text-small text-default-500">
                You submitted: <code>{JSON.stringify(facuraData)}</code>
              </div>
            )}
          </div>
          <div className="flex-1 h-full flex flex-col gap-2">
            <div className="sticky w-full bottom-0 top-0 flex items-center justify-center bg-foreground-50 rounded p-2 font-bold">
              Detalles de Factura
            </div>
            <div className="flex flex-col max-h-[60dvh] md:h-full overflow-y-scroll scrollbar-hide gap-4 z-10">
              {facuraData.detalles &&
                facuraData.detalles.map((detail) => (
                  <div key={detail.id} className="w-full flex flex-col gap-1">
                    <div
                      className="grid grid-cols-12 md:flex justify-evenly w-full gap-2"
                      key={detail.id}
                    >
                      <Input
                        isReadOnly
                        label="Producto"
                        className="max-w-xs col-span-12"
                        labelPlacement="outside"
                        name="producto"
                        placeholder="Nombre del producto"
                        value={detail.nombre_producto}
                        startContent={<Box />}
                        type="text"
                      />
                      <Input
                        isReadOnly
                        className="max-w-24 col-span-4"
                        startContent={<Coins />}
                        label="P. Unitario"
                        labelPlacement="outside"
                        placeholder="0.00"
                        value={detail.precio}
                        type="number"
                      />
                      <Input
                        isReadOnly
                        className="max-w-24 col-span-4"
                        startContent={<Coins />}
                        label="Cantidad"
                        labelPlacement="outside"
                        placeholder="0.00"
                        value={detail.cantidad}
                        type="number"
                      />
                      <Input
                        isReadOnly
                        className="max-w-24 col-span-4"
                        startContent={<Coins />}
                        label="Subtotal"
                        labelPlacement="outside"
                        placeholder="0.00"
                        value={detail.subtotal}
                        type="number"
                      />
                    </div>
                    <Divider key={`dv${detail.id}`} className="my-1" />
                  </div>
                ))}
            </div>
            <div className="flex sticky bottom-0 top-full w-full justify-center items-center bg-foreground-50 rounded p-2"></div>
          </div>
        </section>
        <section className="w-full md:h-[17%] flex items-center justify-center md:justify-start gap-4 pb-8 md:pb-0">
          <Button color={"primary"} className="px-0">
            <Link
              href={"/view/facturas"}
              className="px-2 h-full w-full flex items-center justify-center"
            >
              <ChevronLeft />
            </Link>
          </Button>
        </section>
      </Form>
    </div>
  );
}

export default Factura;
