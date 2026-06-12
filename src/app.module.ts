import { Module } from '@nestjs/common';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ClientesModule } from './clientes/clientes.module';

@Module({
  imports: [UsuariosModule, ClientesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
