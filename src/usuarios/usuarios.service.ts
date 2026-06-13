import { BadRequestException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { PrismaClient } from '../../generated/prisma';
import * as bcrypt from 'bcrypt'
import { FiltroUsuarioDto } from './dto/filtro-usuario.dto';

@Injectable()
export class UsuariosService extends PrismaClient implements OnModuleInit {
  
  async onModuleInit() {
    await this.$connect();
  }

  private async validarCorreoUnico(correo:string,excludeId?: number){
    const existente = await this.usuario.findUnique({ where: { correo } });

    if (existente && existente.id !== excludeId) {
      throw new BadRequestException('Este correo ya está en uso');
    }
  }

  async create(createUsuarioDto: CreateUsuarioDto) {
    const { password, ...userData} = createUsuarioDto;
    await this.validarCorreoUnico(createUsuarioDto.correo);
    const usuario = await this.usuario.create({
      data: {
        ...userData,
        password: await bcrypt.hash(password, 10)
      }
    })
    return usuario; 
  }

  async findAll(filtroUsuarioDto:FiltroUsuarioDto) {
    const { nombre, apellido, rol, limite, pagina } = filtroUsuarioDto;
    const totalPaginas = await this.usuario.count({where:{activo:true}});
    const ultimaPagina = Math.ceil(totalPaginas/limite);
    const usuarios = await this.usuario.findMany({
      where:{
        activo:true
      },
      skip:(pagina-1)*limite,
      take:limite,
    });

    return {
      data: usuarios,
      meta:{
        usuarios: totalPaginas,
        paginaActual: pagina,
        ultimaPagina: ultimaPagina
      }
    };
    
  }

  async findOne(id: number) {
    const usuario = await this.usuario.findUnique({
      where:{
        id,
        activo:true
      }
    });
    if(!usuario){
      throw new NotFoundException(`El usuario con id ${id} no existe`);
    }
    return usuario;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {

    await this.findOne(id);
    const {password, ...usuaioData} = updateUsuarioDto;
    await this.validarCorreoUnico(updateUsuarioDto.correo,id);
    
    const usuario = await this.usuario.update({
      where:{id, activo:true},
      data:{
        ...usuaioData,
        password: password ? await bcrypt.hash(password, 10) : password
      }
    })
    return usuario;
  }

  async remove(id: number) {
    await this.findOne(id);
    
    return await this.usuario.update({
      where:{id, activo:true},
      data:{activo:false}
    });
  }

  async activar(id: number) {
    return await this.usuario.update({
      where:{id, activo:false},
      data:{activo:true}
    })
  }
}
