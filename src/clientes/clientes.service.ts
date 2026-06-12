import {
  Injectable,
  OnModuleInit,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { PrismaClient } from '../../generated/prisma';

@Injectable()
export class ClientesService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async create(createClienteDto: CreateClienteDto) {
    const { correo } = createClienteDto;
    const existe = await this.cliente.findUnique({ where: { correo } });
    if (existe) {
      throw new ConflictException(`El correo ${correo} ya está registrado`);
    }
    return this.cliente.create({ data: createClienteDto });
  }

  async findAll() {
    return this.cliente.findMany();
  }

  async findOne(id: number) {
    const cliente = await this.cliente.findUnique({ where: { id } });
    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }
    return cliente;
  }

  async update(id: number, updateClienteDto: UpdateClienteDto) {
    await this.findOne(id);

    if (updateClienteDto.correo) {
      const existeCorreo = await this.cliente.findUnique({
        where: { correo: updateClienteDto.correo },
      });
      if (existeCorreo && existeCorreo.id !== id) {
        throw new ConflictException(
          `El correo ${updateClienteDto.correo} ya está en uso por otro cliente`,
        );
      }
    }

    return this.cliente.update({
      where: { id },
      data: updateClienteDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.cliente.delete({ where: { id } });
  }

  async activate(id: number) {
    await this.findOne(id);
    return this.cliente.update({
      where: { id },
      data: { activo: true },
    });
  }
}
