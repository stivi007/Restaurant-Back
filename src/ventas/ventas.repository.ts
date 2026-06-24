import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, EstadoVenta } from '../../generated/prisma';

const VENTA_INCLUDE = {
  items:   { include: { producto: true } },
  cliente: true,
} satisfies Prisma.VentaInclude;

@Injectable()
export class VentasRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(desde?: Date, hasta?: Date) {
    return this.prisma.venta.findMany({
      where: this.buildFiltroFechas(desde, hasta),
      orderBy: { creadoEn: 'desc' },
      include: VENTA_INCLUDE,
    });
  }

  findById(id: number) {
    return this.prisma.venta.findUnique({
      where: { id },
      include: VENTA_INCLUDE,
    });
  }

  findProductosByIds(ids: number[]) {
    return this.prisma.producto.findMany({
      where: { id: { in: ids }, activo: true },
    });
  }

  findClienteById(clienteId: number) {
    return this.prisma.cliente.findUnique({ where: { id: clienteId } });
  }

  create(data: Prisma.VentaCreateInput) {
    return this.prisma.venta.create({
      data,
      include: VENTA_INCLUDE,
    });
  }

  updateEstado(id: number, estado: EstadoVenta) {
    return this.prisma.venta.update({
      where: { id },
      data:  { estado },
      include: VENTA_INCLUDE,
    });
  }

  /** Construye el filtro de fechas solo si vienen los parámetros */
  private buildFiltroFechas(desde?: Date, hasta?: Date) {
    if (!desde && !hasta) return {};

    return {
      creadoEn: {
        ...(desde && { gte: desde }),
        ...(hasta && { lte: hasta }),
      },
    };
  }
}