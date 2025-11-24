"use client";
import { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  DateInput,
  Select,
  SelectItem,
  addToast,
} from "@heroui/react";
import { today, getLocalTimeZone } from "@internationalized/date";
import Link from "next/link";
import { User, Calendar, Box, Coins, Trash } from "lucide-react";
import { redirect } from "next/dist/server/api-utils";

function Facturacion() {
  const [submitted, setSubmitted] = useState(null);
  const [details, setDetails] = useState([]);
  const [total, setTotal] = useState(0.0);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/v1/productos`);
        if (!response.ok) {
          redirect("/");
        }
        const result = await response.json();
        if (result.error === "false" && Array.isArray(result.data)) {
          setProducts(result.data);
        } else {
          throw new Error(result.mensaje || "Formato de datos incorrecto");
        }
      } catch (err) {
        redirect("/");
      }
    };

    fetchProducts();
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    const json = {};
    const data = Object.fromEntries(new FormData(e.currentTarget));
    json.cliente = data.cliente;
    json.fecha = data.fecha;
    json.detalles = details.map((detail) => ({
      producto_id: detail.product_id,
      cantidad: detail.cantidad,
    }));
    setSubmitted(json);

    const submitData = async () => {
      try {
        const response = await fetch(`/api/v1/facturas`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(json),
        });
        if (!response.ok) {
          addToast({
            title: "Notificación",
            variant: "flat",
            color: "warning",
            description: "Error al generar la factura",
          });
        }
        const result = await response.json();
        if (result.error === "false") {
          addToast({
            title: "Notificación",
            variant: "flat",
            color: "success",
            description: "Factura generada con exito",
          });
        } else {
          addToast({
            title: "Notificación",
            variant: "flat",
            color: "warning",
            description: "Error al generar la factura",
          });
        }
      } catch (err) {
        addToast({
          title: "Notificación",
          variant: "flat",
          color: "warning",
          description: "Error al enviar la solicitud",
        });
      }
    };

    addToast({
      title: "Notificación",
      variant: "flat",
      description: "Generando la factura, por favor espera...",
      promise: submitData(),
    });
  };

  const addDetail = () => {
    setDetails((prev) => [
      ...prev,
      {
        id: Date.now().toString() + Math.random().toString(16).slice(2),
        product_id: null,
        cantidad: 0,
        precio_unitario: 0,
        subtotal: 0,
      },
    ]);
  };

  const removeDetail = (id) => {
    setDetails((prev) => prev.filter((detail) => detail.id !== id));
    setTotal((prevTotal) => {
      const detailToRemove = details.find((detail) => detail.id === id);
      return prevTotal - (detailToRemove ? detailToRemove.subtotal : 0);
    });
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-6 md:p-0">
      <Form
        className="w-full h-full gap-14 md:gap-0 flex flex-col"
        onSubmit={onSubmit}
      >
        <section className="w-full md:h-[83%] flex flex-col md:flex-row gap-14">
          <div className="md:w-96 h-auto md:h-full flex flex-col gap-4">
            <div className="w-full flex items-center justify-center bg-foreground-50 rounded p-2 font-bold">
              Datos de la Factura
            </div>
            <Input
              isRequired
              errorMessage="Por favor ingresa el nombre del cliente"
              label="Cliente"
              labelPlacement="outside"
              name="cliente"
              placeholder="Ingresa el nombre del cliente"
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
              defaultValue={today(getLocalTimeZone())}
            />
            <Input
              isReadOnly
              startContent={<Coins />}
              label="Total"
              labelPlacement="outside"
              placeholder="0.00"
              value={total}
              type="number"
            />
          </div>
          <div className="flex-1 h-full flex flex-col gap-2">
            <div className="sticky w-full bottom-0 top-0 flex items-center justify-center bg-foreground-50 rounded p-2 font-bold">
              Detalles de Factura
            </div>
            <div className="flex flex-col max-h-[60dvh] md:h-full overflow-y-scroll scrollbar-hide gap-4 z-10">
              {details.map((detail) => (
                <div
                  className="grid grid-cols-12 md:flex justify-evenly w-full gap-2"
                  key={detail.id}
                >
                  <Select
                    isRequired
                    className="max-w-xs col-span-12"
                    label="Producto"
                    labelPlacement={"outside"}
                    placeholder="Selecciona un producto"
                    selectedKeys={detail.product_id ? [detail.product_id] : []}
                    variant={"faded"}
                    startContent={<Box />}
                    onSelectionChange={(keys) => {
                      const product_id = Array.from(keys)[0];
                      const precio_unitario = parseFloat(
                        products.find(
                          (product) => product.id === Number(product_id)
                        )?.precio
                      );
                      setDetails((prev) =>
                        prev.map((d) =>
                          d.id === detail.id
                            ? { ...d, product_id, precio_unitario }
                            : d
                        )
                      );
                    }}
                  >
                    {products.map((product) => (
                      <SelectItem key={product.id}>{product.nombre}</SelectItem>
                    ))}
                  </Select>
                  <Input
                    isReadOnly
                    className="max-w-24 col-span-4"
                    startContent={<Coins />}
                    label="P. Unitario"
                    labelPlacement="outside"
                    placeholder="0.00"
                    value={detail.product_id ? detail.precio_unitario : 0}
                    type="number"
                  />
                  <Input
                    isRequired
                    className="max-w-24 col-span-4"
                    startContent={<Coins />}
                    label="Cantidad"
                    labelPlacement="outside"
                    placeholder="0.00"
                    value={detail.cantidad > 0 ? detail.cantidad : ""}
                    type="number"
                    onChange={(event) => {
                      const cantidad = parseFloat(event.target.value || "0");
                      const subtotal = cantidad * detail.precio_unitario;
                      setTotal((prevTotal) => {
                        const otherDetailsTotal = details
                          .filter((d) => d.id !== detail.id)
                          .reduce((sum, d) => sum + d.subtotal, 0);
                        return otherDetailsTotal + subtotal;
                      });
                      setDetails((prev) =>
                        prev.map((d) =>
                          d.id === detail.id ? { ...d, cantidad, subtotal } : d
                        )
                      );
                    }}
                  />
                  <Input
                    isReadOnly
                    className="max-w-24 col-span-4"
                    startContent={<Coins />}
                    label="Subtotal"
                    labelPlacement="outside"
                    placeholder="0.00"
                    value={detail.product_id ? detail.subtotal : 0}
                    type="number"
                  />
                  <div className="flex items-center justify-center col-span-12">
                    <Button
                      color={"warning"}
                      onPress={() => removeDetail(detail.id)}
                      startContent={<Trash />}
                      size={"sm"}
                      className="w-full md:w-auto"
                    ></Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex sticky bottom-0 top-full w-full justify-center items-center bg-foreground-50 rounded p-2">
              <Button type="button" color={"primary"} onPress={addDetail}>
                Agregar Detalle
              </Button>
            </div>
          </div>
        </section>
        <section className="w-full md:h-[17%] flex items-center justify-center md:justify-start gap-4 pb-8 md:pb-0">
          <Button color={"danger"} className="px-0">
            <Link
              href={"/"}
              className="px-2 h-full w-full flex items-center justify-center"
            >
              Cancelar
            </Link>
          </Button>
          <Button type="submit" color={"primary"}>
            Emitir
          </Button>
        </section>
      </Form>
    </div>
  );
}

export default Facturacion;
