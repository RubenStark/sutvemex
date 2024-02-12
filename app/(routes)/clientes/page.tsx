import prismadb from "@/lib/prismadb";

import { ProductsClient } from "./components/client";
import { ClientColumn } from "./components/columns";

const ProductsPage = async () => {
  const products = await prismadb.client.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedProducts: ClientColumn[] = products.map((item) => ({
    id: item.id,
    nombre: item.nombre,
    direccion: item.direccion,
    poblacion: item.poblacion,
    telefono: item.telefono,
    correo: item.correo,    
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductsClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;
