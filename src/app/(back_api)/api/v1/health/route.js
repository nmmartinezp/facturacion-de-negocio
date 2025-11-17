import { NextResponse } from "next/server";
import pool from "@/app/(back_api)/lib/db";

export async function GET() {
  try {
    // AQUÍ preguntamos a qué base se conectó
    const result = await pool.query("SELECT current_database() as db");

    return NextResponse.json({
      status: "ok",
      database: result.rows[0].db,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: "error", message: error.message },
      { status: 500 }
    );
  }
}