import { Module } from '@nestjs/common';
import { VentasController } from './ventas.controller';
import { VentasService } from './ventas.service';
import { VentasRepository } from './ventas.repository';
import { CartModule } from '../cart/cart.module';

@Module({
  imports:     [CartModule],
  controllers: [VentasController],
  providers:   [VentasService, VentasRepository],
})
export class VentasModule {}