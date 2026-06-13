import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../../generated/prisma';

const VENTA_INCLUDE = {
  items: { include: { producto: true } },
} satisfies Prisma.VentaInclude;

@Injectable()
export class VentasRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.venta.findMany({
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

  create(data: Prisma.VentaCreateInput) {
    return this.prisma.venta.create({
      data,
      include: VENTA_INCLUDE,
    });
  }
}