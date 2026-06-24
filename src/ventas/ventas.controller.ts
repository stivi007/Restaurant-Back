import {
  Controller, Get, Post, Patch, Body,
  Param, Query, ParseIntPipe, HttpCode, HttpStatus,
} from '@nestjs/common';
import { VentasService } from './ventas.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { CrearDesdeCarritoDto } from './dto/crear-desde-carrito.dto';
import { ActualizarEstadoVentaDto } from './dto/actualizar-estado-venta.dto';

@Controller('venta')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  /** POST /api/venta — Registra una nueva venta con items directos */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateVentaDto) {
    return this.ventasService.create(dto);
  }

  /** POST /api/venta/desde-carrito — Convierte el carrito en una venta */
  @Post('desde-carrito')
  @HttpCode(HttpStatus.CREATED)
  crearDesdeCarrito(@Body() dto: CrearDesdeCarritoDto) {
    return this.ventasService.crearDesdeCarrito(dto);
  }

  /** GET /api/venta — Lista ventas, con filtro opcional de fechas */
  @Get()
  findAll(@Query('desde') desde?: string, @Query('hasta') hasta?: string) {
    return this.ventasService.findAll(desde, hasta);
  }

  /** GET /api/venta/:id — Detalle de una venta */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ventasService.findOne(id);
  }

  /** PATCH /api/venta/:id/estado — Cambia el estado de la venta */
  @Patch(':id/estado')
  actualizarEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarEstadoVentaDto,
  ) {
    return this.ventasService.actualizarEstado(id, dto);
  }
}