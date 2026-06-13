import {
  Controller, Get, Post, Delete,
  Body, Query, HttpCode, HttpStatus
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto, RemoveFromCartDto } from './dto/cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  /** POST /api/cart/add — Agrega un producto al carrito */
  @Post('add')
  @HttpCode(HttpStatus.OK)
  async add(@Body() dto: AddToCartDto) {
    return this.cartService.addItem(dto);
  }

  /** DELETE /api/cart/remove — Elimina un producto del carrito */
  @Delete('remove')
  @HttpCode(HttpStatus.OK)
  async remove(@Body() dto: RemoveFromCartDto) {
    return this.cartService.removeItem(dto);
  }

  /** GET /api/cart?sesionId=xxx — Ver carrito con totales */
  @Get()
  async getCart(@Query('sesionId') sesionId: string) {
    return this.cartService.getCart(sesionId);
  }
}