import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const orden = await prismadb.ordenDeEntrega.findFirst({
      where: {
        id: params.orderId,
      },
    });

    if (!orden) {
      return new NextResponse("orden o no encontrado", { status: 404 });
    }

    return NextResponse.json(orden);
  } catch (error) {
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}
