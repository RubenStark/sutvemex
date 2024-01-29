import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { cantidad, codigo, descripcion, precio } = body;

    if (!cantidad || !codigo || !descripcion || !precio) {
      return new NextResponse("Faltan campos", { status: 400 });
    }

    const product = await prismadb.product.create({
      data: {
        cantidad,
        codigo,
        descripcion,
        precio,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}
