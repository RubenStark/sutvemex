import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { ProductsClient } from "./components/client";
import { CotizacionColumn } from "./components/columns";

const CotizacionesPage = async () => {
  const cotizaciones = await prismadb.ordenDeEntrega.findMany({
    where: {
      cotizacion: false,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      products: {
        include: {
          product: true,
        }
      }
    },
  });

  const formattedProducts: CotizacionColumn[] = cotizaciones.map((item) => ({
    id: item.id,
    cliente: item.cliente,
    direccion: `${item.direccion.slice(0, 25)}...`,
    población: item.poblacion,
    atencion: item.atencion,
    fecha: format(new Date(item.createdAt), "dd/MM/yyyy"),
    productos: item.products,
    createdAt: format(new Date(item.createdAt), "dd/MM/yyyy"),
    updatedAt: format(new Date(item.updatedAt), "dd/MM/yyyy"),
    enviado: item.entregado ? "Entregado" : "Pendiente",
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductsClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default CotizacionesPage;
