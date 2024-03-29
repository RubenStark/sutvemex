"use client";

import * as z from "zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Plus, Trash } from "lucide-react";
import { Client, OrdenDeEntrega, Product } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Button as NextButton,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Select as NextSelect,
  SelectItem as NextSelectItem,
} from "@nextui-org/react";

import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { AlertModal } from "@/components/modals/alert-modal";
import { ProductIds } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  cliente: z.string().min(1),
  // direccion: z.string().min(1),
  // poblacion: z.string().min(1),
  atencion: z.string().min(1),
  cotizacion: z.boolean().default(true),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  initialData: OrdenDeEntrega | null;
  allProducts: Product[];
  clients: Client[];
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  allProducts,
  clients,
}) => {
  const params = useParams();
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<ProductIds[]>([]);
  const [productCantidad, setProductCantidad] = useState<number>();
  const [productId, setProductId] = useState<string>();
  const [productCode, setProductCode] = useState<string>();

  const title = initialData ? "Editar cotizacion" : "Crear cotizacion";
  const description = initialData
    ? "Editar una cotizacion."
    : "Añadir una cotizacion";
  const toastMessage = initialData
    ? "Cotizacion actualizada."
    : "Cotizacion creada.";
  const action = initialData ? "Guardar cambios" : "Crear";

  const defaultValues = initialData
    ? {
        ...initialData,
      }
    : {
        cliente: "",
        direccion: "",
        poblacion: "",
        atencion: "",
        consecutivo: "",
        fecha: new Date(),
        productIds: [],
        cotizacion: true,
      };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: ProductFormValues) => {
    if (products.length === 0) {
      toast.error("No hay productos en la cotización.");
      return;
    }

    try {
      setLoading(true);
      if (initialData) {
        const allData = {
          ...data,
          productIds: products.map((product) => ({
            id: product.id,
            cantidad: product.cantidad,
          })),
        };

        if (data.cotizacion) {
          await axios.patch(
            `/api/cotizaciones/${params.cotizacionId}`,
            allData
          );
        } else {
          await axios.patch(`/api/ordenes/${params.cotizacionId}`, allData);
        }
      } else {
        const allData = {
          ...data,
          productIds: products.map((product) => ({
            id: product.id,
            cantidad: product.cantidad,
          })),
        };
        await axios.post(`/api/cotizaciones`, allData);
      }
      router.push(`/cotizaciones`);
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error("No hay productos en stock.");
    } finally {
      setLoading(false);
      router.refresh();
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/cotizaciones/${params.cotizacionId}`);
      toast.success("Product deleted.");
      router.push(`/cotizaciones`);
    } catch (error: any) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
      setOpen(false);
      router.refresh();
    }
  };

  function createProduct() {
    const newProduct = {
      id: productId ?? "",
      cantidad: productCantidad ?? 0,
      codigo: productCode ?? "",
    };

    setProducts([...products, newProduct]);
    onOpenChange();

    setProductCantidad(0);
    setProductId("");
    setProductCode("");
  }

  // Ponemos los productos de la data inicial en el estado de los productos
  useEffect(() => {
    if (initialData) {
      const productsIds = initialData.products.map((product) => ({
        id: product.product.id,
        cantidad: product.cantidad,
        codigo: product.product.codigo,
      }));
      setProducts(productsIds);
    }
  }, []);

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="md:grid md:grid-cols-3 gap-8">
            {/* <FormField
              control={form.control}
              name="cliente"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Cliente del producto"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <FormField
              control={form.control}
              name="cliente"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione un cliente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="direccion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Dirección del producto"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="poblacion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Población</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Población"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <FormField
              control={form.control}
              name="atencion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Atención</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Atención"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cotizacion"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Es una cotización</FormLabel>
                    <FormDescription>
                      Si desea que sea una orden de entrega desmarque esta
                      casilla.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {/* {products?.map((product) => (
              <FormField
                key={product.id}
                name="productIds"
                render={() => (
                  <FormItem>
                    <FormLabel className="flex mt-2">
                      Product: {product.codigo}{" "}
                      <Trash
                        className="h-4 w-4 ml-auto cursor-pointer hover:scale-125"
                        onClick={() => {
                          const newProducts = products.filter(
                            (item) => item.id !== product.id
                          );
                          setProducts(newProducts);
                        }}
                      />
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Atención"
                        value={product.cantidad}
                        readOnly
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))} */}
            
          </div>
          <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <ul>
              {products?.map((product) => (
                <li
                  key={product.id}
                  className="flex items-center justify-between p-2 border-b-2 border-gray-200 w-full"
                >
                  <span className="flex items-center">
                    <span className="mr-2">{product.codigo}:</span>
                    <span>{product.cantidad}</span>
                  </span>
                  <Trash
                    className="h-4 w-4 ml-5 cursor-pointer hover:scale-125"
                    onClick={() => {
                      const newProducts = products.filter(
                        (item) => item.id !== product.id
                      );
                      setProducts(newProducts);
                    }}
                  />
                </li>
              ))}
            </ul>
          </div>
          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button
                disabled={loading}
                variant="secondary"
                size="sm"
                type="button"
                onClick={onOpen}
              >
                <Plus className="h-4 w-4" />
                <span className="ml-2">Añadir producto</span>
              </Button>
            </div>
          </div>

          <Button
            disabled={loading}
            type="button"
            variant="outline"
            onClick={() => router.push("/cotizaciones")}
          >
            Cancelar
          </Button>
          <Button disabled={loading} className="px-7 ml-2" type="submit">
            {action}
          </Button>
        </form>
      </Form>

      <Modal isOpen={isOpen} onOpenChange={createProduct}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Añadir producto
              </ModalHeader>
              <ModalBody>
                <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                  <NextSelect
                    placeholder="Select an product"
                    className="max-w-xs h-10 bg-white"
                    size="sm"
                    variant="bordered"
                    aria-label="Select an product"
                  >
                    {allProducts.map((product) => (
                      <NextSelectItem
                        aria-label="Select an product"
                        key={product.id}
                        value={product.codigo}
                        className="max-w-xs"
                        onClick={() => {
                          setProductId(product.id);
                          setProductCode(product.codigo);
                        }}
                      >
                        {product.codigo}
                      </NextSelectItem>
                    ))}
                  </NextSelect>
                  <Input
                    type="number"
                    placeholder="Cantidad"
                    className="h-12"
                    onChange={(e) => {
                      setProductCantidad(Number(e.target.value));
                    }}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <NextButton color="danger" variant="light" onPress={onClose}>
                  Close
                </NextButton>
                <NextButton color="primary" onPress={onClose}>
                  Action
                </NextButton>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
