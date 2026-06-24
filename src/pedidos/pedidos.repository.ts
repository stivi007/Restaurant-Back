// ─────────────────────────────────────────────────────────────────────────────
// Repositorio: SOLO acceso a datos.
// ─────────────────────────────────────────────────────────────────────────────

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../../generated/prisma';

const PEDIDO_INCLUDE = {
  venta: {
    include: {
      items: { include: { producto: true } },
    },
  },
} satisfies Prisma.PedidoInclude;

@Injectable()
export class PedidosRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Trae el último pedido creado HOY (para calcular el numeroDelDia) */
  findUltimoDeHoy(inicioDelDia: Date, finDelDia: Date) {
    return this.prisma.pedido.findFirst({
      where: {
        fecha: { gte: inicioDelDia, lte: finDelDia },
      },
      orderBy: { numeroDelDia: 'desc' },
    });
  }

  findByVentaId(ventaId: number) {
    return this.prisma.pedido.findUnique({ where: { ventaId } });
  }

  findById(id: number) {
    return this.prisma.pedido.findUnique({
      where: { id },
      include: PEDIDO_INCLUDE,
    });
  }

  create(data: Prisma.PedidoCreateInput) {
    return this.prisma.pedido.create({
      data,
      include: PEDIDO_INCLUDE,
    });
  }
}