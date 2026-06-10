import { Module } from '@nestjs/common';
import { UsuariosModule } from './usuarios/usuarios.module';
import { VentasModule } from './ventas/ventas.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule,UsuariosModule, VentasModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
