import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber, Min, IsEnum, IsPositive } from 'class-validator';

enum Rol{
    ADMIN = 'admin',
    VENDEDOR = 'vendedor',
}

export class FiltroUsuarioDto {

    @IsOptional()
    @IsString()
    nombre?: string;

    @IsOptional()
    @IsString()
    apellido?:string;

    @IsOptional()
    @IsEnum(Rol)
    rol?:Rol;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    @Min(1)
    @Type(() => Number)
    limite?:number=10;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    @Min(1)
    @Type(() => Number)
    pagina?:number=1;
}