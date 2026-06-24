// ─────────────────────────────────────────────────────────────────────────────
// Servicio: lógica de negocio. Genera el numeroDelDia y crea el pedido.
// ─────────────────────────────────────────────────────────────────────────────

import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PedidosRepository } from './pedidos.repository';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PedidosService {
  constructor(
    private readonly pedidosRepository: PedidosRepository,
    private readonly prisma: PrismaService,
  ) {}

  async crear(ventaId: number) {
    const venta = await this.prisma.venta.findUnique({ where: { id: ventaId } });
    if (!venta) {
      throw new NotFoundException(`Venta con id ${ventaId} no encontrada.`);
    }

    const yaExiste = await this.pedidosRepository.findByVentaId(ventaId);
    if (yaExiste) {
      throw new BadRequestException(
        `La venta con id ${ventaId} ya tiene un pedido generado.`,
      );
    }

    const numeroDelDia = await this.generarNumeroDelDia();

    return this.pedidosRepository.create({
      numeroDelDia,
      venta: { connect: { id: ventaId } },
    });
  }

  async findOne(id: number) {
    const pedido = await this.pedidosRepository.findById(id);
    if (!pedido) {
      throw new NotFoundException(`Pedido con id ${id} no encontrado.`);
    }
    return pedido;
  }

  /** Calcula el siguiente número del día, reiniciando a las 00:00 */
  private async generarNumeroDelDia(): Promise<number> {
    const { inicio, fin } = this.obtenerRangoDeHoy();

    const ultimo = await this.pedidosRepository.findUltimoDeHoy(inicio, fin);

    return ultimo ? ultimo.numeroDelDia + 1 : 1;
  }

  private obtenerRangoDeHoy(): { inicio: Date; fin: Date } {
    const ahora = new Date();

    const inicio = new Date(ahora);
    inicio.setHours(0, 0, 0, 0);

    const fin = new Date(ahora);
    fin.setHours(23, 59, 59, 999);

    return { inicio, fin };
  }
}