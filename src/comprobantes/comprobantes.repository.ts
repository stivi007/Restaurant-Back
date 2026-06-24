import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../../generated/prisma';

const COMPROBANTE_INCLUDE = {
  venta: {
    include: {
      cliente: true,
      items: { include: { producto: true } },
    },
  },
} satisfies Prisma.ComprobanteInclude;

@Injectable()
export class ComprobantesRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Trae el último comprobante creado (el de id más alto) */
  findUltimo() {
    return this.prisma.comprobante.findFirst({
      orderBy: { id: 'desc' },
    });
  }

  findByVentaId(ventaId: number) {
    return this.prisma.comprobante.findUnique({
      where: { ventaId },
    });
  }

  findById(id: number) {
    return this.prisma.comprobante.findUnique({
      where: { id },
      include: COMPROBANTE_INCLUDE,
    });
  }

  create(data: Prisma.ComprobanteCreateInput) {
    return this.prisma.comprobante.create({
      data,
      include: COMPROBANTE_INCLUDE,
    });
  }
}