import prismadb from "@/lib/prismadb";
import { ProductIds } from "@/types";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { productIds, atencion, cliente, cotizacion } =
    await req.json();

  const fullCliente = await prismadb.client.findFirst({
    where: {
      id: cliente,
    },
  });

  if (!fullCliente) {
    return new NextResponse("Cliente no encontrado", { status: 404 });
  }

  const direccion = fullCliente.direccion;
  const poblacion = fullCliente.poblacion;
  const clienteNombre = fullCliente.nombre;

  if (!productIds || productIds.length === 0) {
    return new NextResponse("Product ids are required", { status: 400 });
  }

  if (!atencion || !cliente || !cotizacion ) {
    return new NextResponse("Hay un campo faltante", { status: 400 });
  }

  const consecutivo = (await prismadb.ordenDeEntrega.count()).toString();

  const order = await prismadb.ordenDeEntrega.create({
    data: {
      atencion,
      cliente: clienteNombre,
      consecutivo,
      direccion,
      poblacion,
      cotizacion,
      fecha: new Date(),
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
    include: {
      products: {
        include: {
          product: true,
        },
      },
    },
  });

  console.log(JSON.stringify({ "ORDER POST": order }));

  return NextResponse.json(order, { status: 200 });
}

// export async function POST(req: Request) {
//   const { productIds, atencion, cliente, direccion, poblacion, cotizacion } =
//     await req.json();

//   if (!productIds || productIds.length === 0) {
//     return new NextResponse("Product ids are required", { status: 400 });
//   }

//   if (!atencion || !cliente || !direccion || !poblacion) {
//     return new NextResponse("Hay un campo faltante", { status: 400 });
//   }

//   const consecutivo = (await prismadb.ordenDeEntrega.count()).toString();

//   const order = await prismadb.ordenDeEntrega.create({
//     data: {
//       atencion,
//       cliente,
//       consecutivo,
//       direccion,
//       poblacion,
//       cotizacion,
//       fecha: new Date(),
//       products: {
//         create: productIds.map((productId: ProductIds) => ({
//           cantidad: productId.cantidad,
//           product: {
//             connect: {
//               id: productId.id,
//             },
//           },
//         })),
//       },
//     },
//     include: {
//       products: {
//         include: {
//           product: true,
//         },
//       },
//     },
//   });

//   console.log(JSON.stringify({ "ORDER POST": order }));

//   return NextResponse.json(order, { status: 200 });
// }
