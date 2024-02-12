"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

export type ClientColumn = {
  id: string
  nombre: string
  direccion: string
  poblacion: string
  telefono: string
  correo: string
}

export const columns: ColumnDef<ClientColumn>[] = [
  {
    accessorKey: "nombre",
    header: "Nombre",
  },
  {
    accessorKey: "direccion",
    header: "Direccion",
  },
  {
    accessorKey: "poblacion",
    header: "Poblacion",
  },
  {
    accessorKey: "telefono",
    header: "Telefono",
  },
  {
    accessorKey: "correo",
    header: "Correo",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];
