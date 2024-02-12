import prismadb from "@/lib/prismadb";

import { ClientForm } from "./components/product-form";

const ProductPage = async ({ params }: { params: { clienteId: string } }) => {
  const product = await prismadb.client.findUnique({
    where: {
      id: params.clienteId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ClientForm initialData={product} />
      </div>
    </div>
  );
};

export default ProductPage;
