import prismadb from "@/lib/prismadb";
import { ProductIds } from "@/types";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { cotizacionId: string } }
) {
  try {
    // Delete the associated products first
    await prismadb.productOrder.deleteMany({
      where: {
        ordenId: params.cotizacionId,
      },
    });

    // Delete the order
    const cotizacion = await prismadb.ordenDeEntrega.delete({
      where: {
        id: params.cotizacionId,
      },
    });

    return NextResponse.json(cotizacion);
  } catch (error) {
    console.log("[PRODUCT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { cotizacionId: string } }
) {
  try {
    const { productIds, atencion, cliente, direccion, poblacion } =
      await req.json();

    if (!params.cotizacionId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    const consecutivo = `OE${(await prismadb.ordenDeEntrega.count()).toString()}${new Date().getFullYear()}`;
    

    await prismadb.ordenDeEntrega.update({
      where: {
        id: params.cotizacionId,
        cotizacion: true,
      },
      data: {
        consecutivo: consecutivo,
        atencion,
        cliente,
        direccion,
        poblacion,
        products: {
          deleteMany: {},
        },
      },
    });

    const order = await prismadb.ordenDeEntrega.update({
      where: {
        id: params.cotizacionId,
        cotizacion: true,
      },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
      data: {
        products: {
          create: productIds.map((productId: ProductIds) => ({
            cantidad: productId.cantidad,
            product: {
              connect: {
                id: productId.id,
              },
            },
          })),
        },
      },
    });

    console.log(JSON.stringify({ "ORDER PATCH": order }));

    return NextResponse.json(order);
  } catch (error) {
    console.log("[PRODUCT_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { cotizacionId: string } }
) {
  try {
    const order = await prismadb.ordenDeEntrega.findUnique({
      where: {
        id: params.cotizacionId,
      },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.log("[ORDER_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}