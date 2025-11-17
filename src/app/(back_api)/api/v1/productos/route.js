import { NextResponse } from "next/server";
import pool from "@/app/(back_api)/lib/db";

// GET /api/v1/productos
export async function GET() {
  try {
    const { rows } = await pool.query(
      "SELECT id, nombre, descripcion, precio FROM producto ORDER BY id ASC"
    );

    // rows ya es un array de todos los productos
    return NextResponse.json({
      error: "false",
      mensaje: "Productos obtenidos con exito",
      data: rows,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "true", mensaje: "Error al obtener productos" },
      { status: 500 }
    );
  }
}