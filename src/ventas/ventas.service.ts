import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { VentasRepository } from './ventas.repository';
import { CreateVentaDto, ItemVentaDto } from './dto/create-venta.dto';
import { Producto } from '../../generated/prisma';

const TAX_RATE = 0;

@Injectable()
export class VentasService {
  constructor(private readonly ventasRepository: VentasRepository) {}

  async create(dto: CreateVentaDto) {
    const ids       = dto.items.map((i) => i.productoId);
    const productos = await this.ventasRepository.findProductosByIds(ids);

    if (productos.length !== ids.length)
      throw new BadRequestException(
        'Uno o más productos no existen o no están disponibles.'
      );

    const productosMap   = new Map(productos.map((p) => [p.id, p]));
    const itemsConPrecio = this.buildItems(dto.items, productosMap);

    const subtotal = itemsConPrecio.reduce(
      (acc, item) => acc + item.precioUnit * item.cantidad, 0
    );
    const impuesto = parseFloat((subtotal * TAX_RATE).toFixed(2));
    const total    = parseFloat((subtotal + impuesto).toFixed(2));

    return this.ventasRepository.create({
      subtotal,
      impuesto,
      total,
      items: { create: itemsConPrecio },
    });
  }

  findAll() {
    return this.ventasRepository.findAll();
  }

  async findOne(id: number) {
    const venta = await this.ventasRepository.findById(id);
    if (!venta) throw new NotFoundException(`Venta con id ${id} no encontrada.`);
    return venta;
  }

  private buildItems(items: ItemVentaDto[], map: Map<number, Producto>) {
    return items.map((item) => ({
      productoId: item.productoId,
      cantidad:   item.cantidad,
      precioUnit: Number(map.get(item.productoId)!.precio),
    }));
  }
}