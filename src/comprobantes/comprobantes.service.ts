import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ComprobantesRepository } from './comprobantes.repository';
import { PrismaService } from '../prisma/prisma.service';
import { generarComprobantePdf } from './pdf/comprobante-pdf.generator';

const COMPROBANTE_PREFIJO = 'COMP';
const COMPROBANTE_PADDING = 4; // cantidad de dígitos: 0001, 00001, etc.

@Injectable()
export class ComprobantesService {
  constructor(
    private readonly comprobantesRepository: ComprobantesRepository,
    private readonly prisma: PrismaService,
  ) {}

  async crear(ventaId: number) {
    const venta = await this.prisma.venta.findUnique({ where: { id: ventaId } });
    if (!venta) {
      throw new NotFoundException(`Venta con id ${ventaId} no encontrada.`);
    }

    const yaExiste = await this.comprobantesRepository.findByVentaId(ventaId);
    if (yaExiste) {
      throw new BadRequestException(
        `La venta con id ${ventaId} ya tiene un comprobante generado.`,
      );
    }

    const numero = await this.generarNumero();

    return this.comprobantesRepository.create({
      numero,
      venta: { connect: { id: ventaId } },
    });
  }

  async findOne(id: number) {
    const comprobante = await this.comprobantesRepository.findById(id);
    if (!comprobante) {
      throw new NotFoundException(`Comprobante con id ${id} no encontrado.`);
    }
    return comprobante;
  }

  /** Genera el PDF de un comprobante y devuelve el stream listo para enviar */
  async generarPdf(id: number) {
    const comprobante = await this.findOne(id); // reutiliza la validación de existencia
    return generarComprobantePdf(comprobante);
  }

  /** Calcula el siguiente número secuencial, ej: COMP-0048 */
  private async generarNumero(): Promise<string> {
    const ultimo = await this.comprobantesRepository.findUltimo();

    const siguiente = ultimo
      ? this.extraerNumero(ultimo.numero) + 1
      : 1;

    return `${COMPROBANTE_PREFIJO}-${this.rellenarConCeros(siguiente)}`;
  }

  private extraerNumero(numeroComprobante: string): number {
    const partes = numeroComprobante.split('-');
    return parseInt(partes[1], 10);
  }

  private rellenarConCeros(numero: number): string {
    return numero.toString().padStart(COMPROBANTE_PADDING, '0');
  }
}