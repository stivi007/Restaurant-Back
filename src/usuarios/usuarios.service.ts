import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { PrismaClient } from '../../generated/prisma';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async create(createUsuarioDto: CreateUsuarioDto) {
    const { password, ...userData } = createUsuarioDto;
    const usuario = await this.usuario.create({
      data: {
        ...userData,
        password: await bcrypt.hash(password, 10),
      },
    });
    return usuario;
  }

  findAll() {
    return `This action returns all usuarios`;
  }

  findOne(id: number) {
    return `This action returns a #${id} usuario`;
  }

  update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return `This action updates a #${id} usuario`;
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }
}
