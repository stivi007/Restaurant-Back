import {
  Controller, Get, Post, Res,
  Param, ParseIntPipe, HttpCode, HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ComprobantesService } from './comprobantes.service';

@Controller('comprobante')
export class ComprobantesController {
  constructor(private readonly comprobantesService: ComprobantesService) {}

  /** POST /api/comprobante/:ventaId — Genera el comprobante de una venta */
  @Post(':ventaId')
  @HttpCode(HttpStatus.CREATED)
  crear(@Param('ventaId', ParseIntPipe) ventaId: number) {
    return this.comprobantesService.crear(ventaId);
  }

  /** GET /api/comprobante/:id — Consulta un comprobante */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.comprobantesService.findOne(id);
  }

  /** GET /api/comprobante/:id/pdf — Descarga el comprobante en PDF */
  @Get(':id/pdf')
  async descargarPdf(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const comprobante = await this.comprobantesService.findOne(id);
    const pdfDoc = await this.comprobantesService.generarPdf(id);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${comprobante.numero}.pdf"`,
    );

    pdfDoc.pipe(res);
  }
}