import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { envs } from 'src/config/envs';
import { AuthGuard } from 'src/guards/auth.guard';

@Module({
  controllers: [AuthController],
  providers: [AuthService,AuthGuard],
  imports:[
    PassportModule.register({defaultStrategy:'jwt'}),
    JwtModule.registerAsync({
      useFactory:()=>{
        return{
          secret: envs.jwtSecret,
          signOptions:{expiresIn:'8h'}
        }
      }
    })
    
  ],
  exports:[AuthGuard,JwtModule]
})
export class AuthModule {}
