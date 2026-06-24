import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../../generated/prisma';

const CARRITO_INCLUDE = {
  items: { include: { producto: true } },
} satisfies Prisma.CarritoInclude;

@Injectable()
export class CartRepository {
  constructor(private readonly prisma: PrismaService) {}

  findBySesion(sesionId: string) {
    return this.prisma.carrito.findUnique({
      where: { sesionId },
      include: CARRITO_INCLUDE,
    });
  }

  upsertCarrito(sesionId: string) {
    return this.prisma.carrito.upsert({
      where:  { sesionId },
      update: {},
      create: { sesionId },
    });
  }

  findItem(carritoId: number, productoId: number) {
    return this.prisma.itemCarrito.findUnique({
      where: { carritoId_productoId: { carritoId, productoId } },
    });
  }

  createItem(carritoId: number, productoId: number, cantidad: number) {
    return this.prisma.itemCarrito.create({
      data: { carritoId, productoId, cantidad },
    });
  }

  updateItemCantidad(itemId: number, cantidad: number) {
    return this.prisma.itemCarrito.update({
      where: { id: itemId },
      data:  { cantidad },
    });
  }

  deleteItem(itemId: number) {
    return this.prisma.itemCarrito.delete({ where: { id: itemId } });
  }

  findProducto(productoId: number) {
    return this.prisma.producto.findUnique({ where: { id: productoId } });
  }

  vaciarCarrito(carritoId: number) {
    return this.prisma.itemCarrito.deleteMany({
      where: { carritoId },
    });
  }
}