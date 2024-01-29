import prismadb from "@/lib/prismadb";

import { ProductForm } from "./components/product-form";

const CotizacionesPage = async ({
  params,
}: {
  params: { cotizacionId: string };
}) => {
  const cotizacion = await prismadb.ordenDeEntrega.findUnique({
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
  });

  const products = await prismadb.product.findMany();

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm initialData={cotizacion} allProducts={products} />
      </div>
    </div>
  );
};

export default CotizacionesPage;
