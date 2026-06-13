import { Module } from '@nestjs/common';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { VentasModule } from './ventas/ventas.module';
import { ProductosModule } from './productos/productos.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [UsuariosModule, AuthModule,ProductosModule,],
  controllers: [],
  providers: [],
})
export class AppModule {}