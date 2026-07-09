import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';  // ← desde 'path', no de prisma
import { PrismaModule } from './prisma/prisma.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { ProductosModule } from './productos/productos.module';
import { VentasModule } from './ventas/ventas.module';
import { CartModule } from './cart/cart.module';
import { ClientesModule } from './clientes/clientes.module';
import { ComprobantesModule } from './comprobantes/comprobantes.module';
import { PedidosModule } from './pedidos/pedidos.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    PrismaModule,
    UsuariosModule,
    AuthModule,
    ProductosModule,
    VentasModule,
    CartModule,
    ClientesModule,
    ComprobantesModule,
    PedidosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}