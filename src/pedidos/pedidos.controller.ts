import {
  Controller, Post, Get, Res,
  Param, ParseIntPipe, HttpCode, HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { PedidosService } from './pedidos.service';
import { generarPedidoPdf } from './pdf/pedido-pdf.generator';

@Controller('pedido')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  /**Genera el ticket de cocina de una venta */
  @Post(':ventaId')
  @HttpCode(HttpStatus.CREATED)
  crear(@Param('ventaId', ParseIntPipe) ventaId: number) {
    return this.pedidosService.crear(ventaId);
  }

  /** Descarga el ticket en PDF (sin precios) */
  @Get(':id/pdf')
  async descargarPdf(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const pedido = await this.pedidosService.findOne(id);
    const pdfDoc = generarPedidoPdf(pedido);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="pedido-${pedido.numeroDelDia}.pdf"`,
    );

    pdfDoc.pipe(res);
  }
}
