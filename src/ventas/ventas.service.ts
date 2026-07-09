import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { VentasRepository } from './ventas.repository';
import { CartRepository } from '../cart/cart.repository';
import { CreateVentaDto } from './dto/create-venta.dto';
import { CrearDesdeCarritoDto } from './dto/crear-desde-carrito.dto';
import { ActualizarEstadoVentaDto } from './dto/actualizar-estado-venta.dto';
import { Producto } from '../../generated/prisma';

const TAX_RATE = 0;

@Injectable()
export class VentasService {
  constructor(
    private readonly ventasRepository: VentasRepository,
    private readonly cartRepository: CartRepository,
  ) {}

  // ── POST /api/venta ──────────────────────────────────────────────────────────
  async create(dto: CreateVentaDto) {
    const ids       = dto.items.map((i) => i.productoId);
    const productos = await this.ventasRepository.findProductosByIds(ids);

    this.validarProductosEncontrados(ids, productos);

    const itemsConPrecio = this.buildItemsConPrecio(dto.items, productos);
    const totales        = this.calcularTotales(itemsConPrecio);

    return this.ventasRepository.create({
      ...totales,
      tipoEntrega: dto.tipoEntrega,
      items: { create: itemsConPrecio },
    });
  }

  async crearDesdeCarrito(dto: CrearDesdeCarritoDto) {
    const { sesionId, clienteId } = dto;

    const carrito = await this.cartRepository.findBySesion(sesionId);
    if (!carrito || carrito.items.length === 0) {
      throw new BadRequestException('El carrito está vacío.');
    }

    if (clienteId) {
      await this.validarClienteExiste(clienteId);
    }

    const itemsCarrito = carrito.items.map((item) => ({
      productoId: item.productoId,
      cantidad:   item.cantidad,
    }));

    const productos = await this.ventasRepository.findProductosByIds(
      itemsCarrito.map((i) => i.productoId),
    );
    this.validarProductosEncontrados(
      itemsCarrito.map((i) => i.productoId),
      productos,
    );

    const itemsConPrecio = this.buildItemsConPrecio(itemsCarrito, productos);
    const totales        = this.calcularTotales(itemsConPrecio);

    const venta = await this.ventasRepository.create({
      ...totales,
      tipoEntrega: dto.tipoEntrega,
      ...(clienteId && { cliente: { connect: { id: clienteId } } }),
      items: { create: itemsConPrecio },
    });

    await this.cartRepository.vaciarCarrito(carrito.id);

    return venta;
  }

  // ── GET /api/venta?desde=&hasta= ────────────────────────────────────────────
  findAll(desde?: string, hasta?: string) {
    return this.ventasRepository.findAll(
      desde ? new Date(desde) : undefined,
      hasta ? new Date(hasta) : undefined,
    );
  }

  // ── GET /api/venta/:id ───────────────────────────────────────────────────────
  async findOne(id: number) {
    const venta = await this.ventasRepository.findById(id);
    if (!venta) throw new NotFoundException(`Venta con id ${id} no encontrada.`);
    return venta;
  }

  // ── PATCH /api/venta/:id/estado ─────────────────────────────────────────────
  async actualizarEstado(id: number, dto: ActualizarEstadoVentaDto) {
    await this.findOne(id); // valida que exista, lanza 404 si no
    return this.ventasRepository.updateEstado(id, dto.estado);
  }

  // ── Helpers privados ─────────────────────────────────────────────────────────

  private validarProductosEncontrados(idsSolicitados: number[], encontrados: Producto[]): void {
    if (encontrados.length !== idsSolicitados.length) {
      throw new BadRequestException(
        'Uno o más productos no existen o no están activos.',
      );
    }
  }

  private async validarClienteExiste(clienteId: number): Promise<void> {
    const cliente = await this.ventasRepository.findClienteById(clienteId);
    if (!cliente) {
      throw new BadRequestException(`Cliente con id ${clienteId} no encontrado.`);
    }
  }

  private buildItemsConPrecio(
    items: { productoId: number; cantidad: number }[],
    productos: Producto[],
  ) {
    const productosMap = new Map(productos.map((p) => [p.id, p]));
    return items.map((item) => ({
      productoId: item.productoId,
      cantidad:   item.cantidad,
      precioUnit: Number(productosMap.get(item.productoId).precio),
    }));
  }

  private calcularTotales(items: { precioUnit: number; cantidad: number }[]) {
    const subtotal = items.reduce(
      (acc, item) => acc + item.precioUnit * item.cantidad, 0,
    );
    const impuesto = parseFloat((subtotal * TAX_RATE).toFixed(2));
    const total    = parseFloat((subtotal + impuesto).toFixed(2));
    return { subtotal, impuesto, total };
  }
}