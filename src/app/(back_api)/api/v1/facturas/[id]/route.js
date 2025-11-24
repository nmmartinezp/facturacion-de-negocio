import { NextResponse } from "next/server";
import pool from "@/app/(back_api)/lib/db";

// GET /api/v1/facturas/:id
export async function GET(_request, { params }) {
  const { id } = await params;

  try {
    const facturaRes = await pool.query(
      "SELECT id, cliente, fecha, total FROM factura WHERE id = $1",
      [id]
    );

    if (facturaRes.rowCount === 0) {
      return NextResponse.json(
        { error: "true", mensaje: "Factura no encontrada" },
        { status: 404 }
      );
    }

    const factura = facturaRes.rows[0];

    const detallesRes = await pool.query(
      `
        SELECT
          d.id,
          d.producto_id,
          p.nombre AS nombre_producto,
          p.precio,
          d.cantidad,
          d.subtotal
        FROM detalle d
        JOIN producto p ON d.producto_id = p.id
        WHERE d.factura_id = $1
      `,
      [id]
    );

    factura.detalles = detallesRes.rows;

    return NextResponse.json({
      error: "false",
      mensaje: "Factura obtenida con exito",
      data: factura,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "true", mensaje: "Error al obtener factura" },
      { status: 500 }
    );
  }
}

// DELETE /api/v1/facturas/:id
export async function DELETE(_request, { params }) {
  const { id } = params;

  try {
    const res = await pool.query("DELETE FROM factura WHERE id = $1", [id]);

    if (res.rowCount === 0) {
      return NextResponse.json(
        { error: "true", mensaje: "Factura no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      error: "false",
      mensaje: "Factura eliminada con exito",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "true", mensaje: "Error al eliminar factura" },
      { status: 500 }
    );
  }
}
