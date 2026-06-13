import { Module } from '@nestjs/common';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { VentasModule } from './ventas/ventas.module';
import { PrismaModule } from './prisma/prisma.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [
    PrismaModule,
    UsuariosModule,
    AuthModule,
    VentasModule,
    CartModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}