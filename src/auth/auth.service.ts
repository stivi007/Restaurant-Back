import { Injectable,OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { PrismaClient } from '../../generated/prisma';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt.payload';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit{

  constructor(private readonly jwtService: JwtService){
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }
  async singJwt(payload: JwtPayload){
    return this.jwtService.sign(payload);
  }
  async logIn(createAuthDto: CreateAuthDto) {
    const {correo, password} = createAuthDto;
    const usuario = await this.usuario.findUnique({
      where:{correo, activo:true},
      select:{id:true, correo:true, password:true, rol:true}
    });
    if(!usuario) throw new UnauthorizedException('Credenciales invalidas');
    if(!bcrypt.compareSync(password, usuario.password)) throw new UnauthorizedException('Credenciales invalidas');
    return {
      usuario,
      token: await this.singJwt({id:usuario.id.toString(),correo:usuario.correo, rol:usuario.rol})
    }
  }

}
