import { Module } from '@nestjs/common';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ClientesModule } from './clientes/clientes.module';
import { ProductosModule } from './productos/productos.module';

@Module({
  imports: [UsuariosModule, ClientesModule, ProductosModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
