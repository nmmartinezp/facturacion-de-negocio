import { GET } from "../src/app/(back_api)/api/v1/health/route";
import pool from "@/app/(back_api)/lib/db";
import { NextResponse } from "next/server";

// Mock del pool
jest.mock("@/app/(back_api)/lib/db", () => ({
  __esModule: true,
  default: {
    query: jest.fn(),
  },
}));

// Mock de NextResponse
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((body, init) => ({ body, init })),
  },
}));

describe("GET /api/v1/health", () => {
  beforeEach(() => jest.clearAllMocks());

  test("✔ debe devolver status='ok' y el nombre de la base de datos", async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{ db: "facturacion_db" }],
    });

    const res = await GET();

    expect(pool.query).toHaveBeenCalledWith(
      "SELECT current_database() as db"
    );

    expect(res.body).toEqual({
      status: "ok",
      database: "facturacion_db",
    });
  });

  test("✔ debe manejar error de la BD y devolver status='error' con 500", async () => {
    const fakeError = new Error("Fallo la BD");
    pool.query.mockRejectedValueOnce(fakeError);

    const res = await GET();

    expect(res.body).toEqual({
      status: "error",
      message: "Fallo la BD",
    });

    expect(res.init).toEqual({ status: 500 });
  });

  /*
  ❌ TEST QUE FALLA A PROPÓSITO (RESERVADO)
  NO SE EJECUTA

  test("❌ test que falla a propósito (espera status 201)", async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{ db: "otra_db" }],
    });

    const res = await GET();

    // Este EXPECT está mal a propósito: tu handler no devuelve 201
    expect(res.init).toEqual({ status: 201 });
  });
  */

});