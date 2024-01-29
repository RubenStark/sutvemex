import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const body = await req.json();

    const { cantidad, codigo, descripcion, precio } = body;

    if (!cantidad || !codigo || !descripcion || !precio) {
      return new NextResponse("Faltan campos", { status: 400 });
    }

    const product = await prismadb.product.update({
      where: {
        id: params.productId,
      },
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

export async function DELETE(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const product = await prismadb.product.delete({
      where: {
        id: params.productId,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}