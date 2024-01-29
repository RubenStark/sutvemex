"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { CotizacionColumn, columns } from "./columns";

interface ProductsClientProps {
  data: CotizacionColumn[];
};

export const ProductsClient: React.FC<ProductsClientProps> = ({
  data
}) => {
  const router = useRouter();

  return (
    <> 
      <div className="flex items-center justify-between">
        <Heading title={`Cotizaciones (${data.length})`} description="Maneje las cotizaciones" />
        <Button onClick={() => router.push(`/cotizaciones/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="cliente" columns={columns} data={data} />
    </>
  );
};
