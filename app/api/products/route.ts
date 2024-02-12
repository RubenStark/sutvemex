import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { cantidad, codigo, descripcion, precio } = body;

    const existeProductoConMismoCodigo = await prismadb.product.findFirst({
      where: {
        codigo,
      },
    });

    const existeProductoConMismaDescripcion = await prismadb.product.findFirst({
      where: {
        descripcion,
      },
    });

    if (existeProductoConMismoCodigo || existeProductoConMismaDescripcion) {
      return new NextResponse("Ya existe un producto con esas propiedades", {
        status: 400,
      });
    }

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
