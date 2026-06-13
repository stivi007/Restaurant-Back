import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";



export const Usuario = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();

        if(!request.usuario ){
            throw new InternalServerErrorException('Usuario no encontrado en la request - AuthGuard no funciona correctamente');
        }

        return request.usuario;
    }
)