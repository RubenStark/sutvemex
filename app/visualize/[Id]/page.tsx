"use client";

import { OrdenDeEntrega } from "@prisma/client";
import axios from "axios";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function Visualize() {
  const [cotizacion, setCotizacion] = useState<OrdenDeEntrega>();
  const { Id } = useParams<{ Id: string }>();

  async function getCotizacion(Id: string) {
    try {
      const response = await axios.get(`/api/cotizaciones/${Id}`);
      const cotizacion = response.data;
      setCotizacion(cotizacion);
      console.log(cotizacion);
    } catch (error) {
      toast.error("Error al cargar la cotizacion");
      console.error(error);
    }
  }

  useEffect(() => {
    getCotizacion(Id);
  }, []);

  const total = cotizacion?.products.reduce(
    (total, producto) => total + producto.cantidad * producto.product.precio,
    0
  );

  const iva = total * 0.16;

  return (
    <div id="pdf-content">
      <div className="w-screen flex justify-center">
        <div className="w-full max-w-3xl my-5 relative">
          <p>HUMBERTO ALEM MENDOZA LOPEZ</p>
          <p>MELH670721TP3</p>
          <p>Domicilio Fiscal</p>
          <p>Toluca de Lerdo, Estado de Mexico</p>
          <p>Tel. celular 729-147-46-21 /722-554-80-77</p>
          <img src="/logo.png" alt="logo" className="h-32 ml-auto absolute top-0 right-0" />
        </div>
      </div>

      <div className="w-screen flex justify-center">
        <div className="flex w-full max-w-3xl justify-center border-t border-black border-x p-3">
          <div>
            <p>Cliente: {cotizacion?.cliente}</p>
            <p>Direccion: {cotizacion?.direccion}</p>
            <p>Poblacion: {cotizacion?.poblacion}</p>
            <p>Atencion: {cotizacion?.atencion}</p>
          </div>
          <div className="ml-auto">
            <p className="ml-auto">
              Orden de entrega: {cotizacion?.consecutivo}
            </p>
            <p className="ml-auto">Fecha: Fecha</p>
          </div>
        </div>
      </div>

      <div className="w-screen flex justify-center">
        <table
          style={{ borderCollapse: "collapse", width: "100%" }}
          className="w-full max-w-3xl"
        >
          <thead>
            <tr>
              <th style={{ border: "1px solid black", padding: "8px" }}>
                Cantidad
              </th>
              <th style={{ border: "1px solid black", padding: "8px" }}>
                U. Medida
              </th>
              <th style={{ border: "1px solid black", padding: "8px" }}>
                Codigo
              </th>
              <th style={{ border: "1px solid black", padding: "8px" }}>
                Descripcion
              </th>
              <th style={{ border: "1px solid black", padding: "8px" }}>
                P/Unit.
              </th>
              <th style={{ border: "1px solid black", padding: "8px" }}>
                Importe
              </th>
            </tr>
          </thead>
          <tbody>
            {cotizacion?.products.map((producto) => (
              <tr>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  {producto.cantidad}
                </td>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  U. Medida
                </td>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  {producto.product.codigo}
                </td>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  {producto.product.descripcion}
                </td>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  {producto.product.precio}
                </td>
                <th style={{ border: "1px solid black", padding: "8px" }}>
                  {producto.product.precio * producto.cantidad}
                </th>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td
                colSpan={6}
                style={{
                  border: "1px solid black",
                  padding: "8px",
                  textAlign: "right",
                }}
              >
                Total: {total}
              </td>
            </tr>
            <tr>
              <td
                colSpan={6}
                style={{
                  border: "1px solid black",
                  padding: "8px",
                  textAlign: "right",
                }}
              >
                IVA: {iva}
              </td>
            </tr>
            <tr>
              <td
                colSpan={6}
                style={{
                  border: "1px solid black",
                  padding: "8px",
                  textAlign: "right",
                }}
              >
                SUBTOTAL: {total + iva}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default Visualize;
