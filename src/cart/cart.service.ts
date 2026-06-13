import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CartRepository } from './cart.repository';
import { CartMapper } from './cart.mapper';
import { AddToCartDto, RemoveFromCartDto } from './dto/cart.dto';

@Injectable()
export class CartService {
  constructor(private readonly cartRepository: CartRepository) {}

  async addItem(dto: AddToCartDto) {
    const { sesionId, productoId, cantidad = 1 } = dto;

    await this.validarProductoDisponible(productoId);

    const carrito       = await this.cartRepository.upsertCarrito(sesionId);
    const itemExistente = await this.cartRepository.findItem(carrito.id, productoId);

    if (itemExistente) {
      await this.cartRepository.updateItemCantidad(
        itemExistente.id,
        itemExistente.cantidad + cantidad,
      );
    } else {
      await this.cartRepository.createItem(carrito.id, productoId, cantidad);
    }

    return this.getCart(sesionId);
  }

  async removeItem(dto: RemoveFromCartDto) {
    const { sesionId, productoId } = dto;

    const carrito = await this.cartRepository.findBySesion(sesionId);
    if (!carrito)
      throw new NotFoundException(`No existe carrito para la sesión "${sesionId}".`);

    const item = await this.cartRepository.findItem(carrito.id, productoId);
    if (!item)
      throw new NotFoundException(`El producto con id ${productoId} no está en el carrito.`);

    await this.cartRepository.deleteItem(item.id);
    return this.getCart(sesionId);
  }

  async getCart(sesionId: string) {
    const carrito = await this.cartRepository.findBySesion(sesionId);
    if (!carrito) return CartMapper.toEmptyResponse(sesionId);
    return CartMapper.toResponse(carrito);
  }

  private async validarProductoDisponible(productoId: number): Promise<void> {
    const producto = await this.cartRepository.findProducto(productoId);
    if (!producto)
      throw new BadRequestException(`Producto con id ${productoId} no encontrado.`);
    if (!producto.activo)
      throw new BadRequestException(`Producto con id ${productoId} no está disponible.`);
  }
}