import prismadb from "@/lib/prismadb";
import { ProductIds } from "@/types";
import { NextResponse } from "next/server";

// export async function PATCH(
//   req: Request,
//   { params }: { params: { ordenId: string } }
// ) {
//   try {
//     const { productIds, atencion, cliente, direccion, poblacion } =
//       await req.json();

//     if (!params.ordenId) {
//       return new NextResponse("Product id is required", { status: 400 });
//     }

//     // descontar los productos de inventario

//     for (const productId of productIds) {
//       const product = await prismadb.product.findUnique({
//         where: {
//           id: productId.id,
//         },
//       });

//       if (product) {
//         if (productId.cantidad > product.cantidad) {
//           return new NextResponse("No hay productos suficientes en stock", { status: 400 });
//         }
//         await prismadb.product.update({
//           where: {
//             id: productId.id,
//           },
//           data: {
//             cantidad: product.cantidad - productId.cantidad,
//           },
//         });
//       }
//     }

//     await prismadb.ordenDeEntrega.update({
//       where: {
//         id: params.ordenId,
//         cotizacion: false,
//         entregado: true,
//       },
//       data: {
//         consecutivo: (await prismadb.ordenDeEntrega.count()).toString(),
//         atencion,
//         cliente,
//         direccion,
//         poblacion,
//         products: {
//           deleteMany: {},
//         },
//       },
//     });

//     const order = await prismadb.ordenDeEntrega.update({
//       where: {
//         id: params.ordenId,
//         cotizacion: false,
//         entregado: true,
//       },
//       include: {
//         products: {
//           include: {
//             product: true,
//           },
//         },
//       },
//       data: {
//         products: {
//           create: productIds.map((productId: ProductIds) => ({
//             cantidad: productId.cantidad,
//             product: {
//               connect: {
//                 id: productId.id,
//               },
//             },
//           })),
//         },
//       },
//     });

//     console.log(JSON.stringify({ "ORDER PATCH": order }));

//     return NextResponse.json(order);
//   } catch (error) {
//     console.log("[PRODUCT_PATCH]", error);
//     return new NextResponse("Internal error", { status: 500 });
//   }
// }

export async function PATCH(
  req: Request,
  { params }: { params: { ordenId: string } }
) {
  try {
    const { productIds, atencion, cliente, direccion, poblacion, entregado } =
      await req.json();

    if (!params.ordenId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    // descontar los productos de inventario
    if (entregado) {
      for (const productId of productIds) {
        const product = await prismadb.product.findUnique({
          where: {
            id: productId.id,
          },
        });

        if (product) {
          if (productId.cantidad > product.cantidad) {
            console.log(productId.cantidad, product.cantidad);
            return new NextResponse("No hay productos suficientes en stock", {
              status: 400,
            });
          }
        }
      }

      for (const productId of productIds) {
        const product = await prismadb.product.findUnique({
          where: {
            id: productId.id,
          },
        });

        if (product) {
          await prismadb.product.update({
            where: {
              id: productId.id,
            },
            data: {
              cantidad: product.cantidad - productId.cantidad,
            },
          });
        }
      }
    }

    await prismadb.ordenDeEntrega.update({
      where: {
        id: params.ordenId,
      },
      data: {
        consecutivo: (await prismadb.ordenDeEntrega.count()).toString(),
        atencion,
        cliente,
        direccion,
        poblacion,
        cotizacion: false,
        entregado,
        products: {
          deleteMany: {},
        },
      },
    });

    const order = await prismadb.ordenDeEntrega.update({
      where: {
        id: params.ordenId,
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
