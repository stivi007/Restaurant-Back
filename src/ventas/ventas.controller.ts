import {
  Controller, Get, Post, Body,
  Param, ParseIntPipe, HttpCode, HttpStatus
} from '@nestjs/common';
import { VentasService } from './ventas.service';
import { CreateVentaDto } from './dto/create-venta.dto';

@Controller('venta')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  /** POST /api/venta — Registra una nueva venta */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateVentaDto) {
    return this.ventasService.create(dto);
  }

  /** GET /api/venta — Lista todas las ventas */
  @Get()
  async findAll() {
    return this.ventasService.findAll();
  }

  /** GET /api/venta/:id — Detalle de una venta */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ventasService.findOne(id);
  }
}
