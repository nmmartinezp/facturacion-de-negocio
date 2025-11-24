import { NextResponse } from "next/server";
import pool from "@/app/(back_api)/lib/db";

// GET /api/v1/facturas
export async function GET() {
  try {
    const { rows } = await pool.query(
      "SELECT id, cliente, fecha, total FROM factura ORDER BY fecha DESC"
    );

    return NextResponse.json({
      error: "false",
      mensaje: "Facturas obtenidas con exito",
      data: rows,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "true", mensaje: "Error al obtener facturas" },
      { status: 500 }
    );
  }
}

// POST /api/v1/facturas
export async function POST(request) {
  const body = await request.json();
  const { cliente, fecha, detalles } = body;

  if (!cliente || !Array.isArray(detalles) || detalles.length === 0) {
    return NextResponse.json(
      { error: "true", mensaje: "cliente y detalles son requeridos" },
      { status: 400 }
    );
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const facturaRes = await client.query(
      `
        INSERT INTO factura (cliente, fecha, total)
        VALUES ($1, COALESCE($2, NOW()), 0)
        RETURNING id;
      `,
      [cliente, fecha || null]
    );
    const facturaId = facturaRes.rows[0].id;

    let total = 0;

    for (const item of detalles) {
      const { producto_id, cantidad } = item;

      const prod = await client.query(
        "SELECT precio FROM producto WHERE id = $1",
        [producto_id]
      );

      if (prod.rowCount === 0) {
        throw new Error(`Producto ${producto_id} no existe`);
      }

      const precio = Number(prod.rows[0].precio);
      const subtotal = precio * Number(cantidad);
      total += subtotal;

      await client.query(
        `
          INSERT INTO detalle (factura_id, producto_id, cantidad, subtotal)
          VALUES ($1, $2, $3, $4);
        `,
        [facturaId, producto_id, cantidad, subtotal]
      );
    }

    await client.query(
      "UPDATE factura SET total = $1 WHERE id = $2",
      [total, facturaId]
    );

    await client.query("COMMIT");

    return NextResponse.json({
      error: "false",
      mensaje: "Factura registrada correctamente",
      data: { id: facturaId, total },
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    return NextResponse.json(
      { error: "true", mensaje: "Error al registrar factura" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}