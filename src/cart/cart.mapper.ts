import { Carrito, ItemCarrito, Producto } from '../../generated/prisma';

type CarritoConItems = Carrito & {
  items: (ItemCarrito & { producto: Producto })[];
};

export class CartMapper {
  static toResponse(carrito: CarritoConItems) {
    const subtotal = carrito.items.reduce(
      (acc, item) => acc + Number(item.producto.precio) * item.cantidad, 0
    );

    return {
      sesionId: carrito.sesionId,
      items: carrito.items.map((item) => ({
        id:           item.id,
        productoId:   item.productoId,
        nombre:       item.producto.nombre,
        precioUnit:   Number(item.producto.precio),
        cantidad:     item.cantidad,
        subtotalItem: Number(item.producto.precio) * item.cantidad,
      })),
      subtotal:  parseFloat(subtotal.toFixed(2)),
      impuesto:  0,
      total:     parseFloat(subtotal.toFixed(2)),
    };
  }

  static toEmptyResponse(sesionId: string) {
    return { sesionId, items: [], subtotal: 0, impuesto: 0, total: 0 };
  }
}