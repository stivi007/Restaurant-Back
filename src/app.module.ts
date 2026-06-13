import { Module } from '@nestjs/common';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { VentasModule } from './ventas/ventas.module';
import { ProductosModule } from './productos/productos.module';
import { CartModule } from './cart/cart.module';
import { ClientesModule } from './clientes/clientes.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule,UsuariosModule, AuthModule,ProductosModule,VentasModule,CartModule, ClientesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}