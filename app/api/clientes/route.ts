import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { correo, direccion, nombre, telefono, poblacion } = body;

    if (!correo || !direccion || !nombre || !telefono || !poblacion) {
      return new NextResponse("Faltan campos", { status: 400 });
    }

    const cliente = await prismadb.client.create({
      data: {
        poblacion,
        correo,
        direccion,
        nombre,
        telefono
      },
    });

    return NextResponse.json(cliente);
  } catch (error) {
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}
