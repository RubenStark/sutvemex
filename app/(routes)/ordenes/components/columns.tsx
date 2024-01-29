"use client"

import { ProductOrder } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

export type CotizacionColumn = {
  id: string
  cliente: string
  direccion: string
  población: string
  atencion: string
  fecha: string
  productos: ProductOrder[]
  createdAt: string
  updatedAt: string
}

export const columns: ColumnDef<CotizacionColumn>[] = [
  {
    accessorKey: "cliente",
    header: "Cliente",
  },
  {
    accessorKey: "direccion",
    header: "Direccion",
  },
  {
    accessorKey: "población",
    header: "Población",
  },
  {
    accessorKey: "atencion",
    header: "Atencion",
  },
  {
    accessorKey: "fecha",
    header: "Fecha",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];
