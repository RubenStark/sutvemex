"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

export type ProductColumn = {
  id: string
  cantidad: number
  codigo: string
  descripcion: string
  precio: number
}

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "cantidad",
    header: "Cantidad",
  },
  {
    accessorKey: "codigo",
    header: "Codigo",
  },
  {
    accessorKey: "descripcion",
    header: "Descripcion",
  },
  {
    accessorKey: "precio",
    header: "Precio",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];
