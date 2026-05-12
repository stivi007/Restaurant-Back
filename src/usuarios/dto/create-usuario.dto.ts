import { IsEnum, IsNotEmpty, IsString, MaxLength } from "class-validator";

enum Rol{
    ADMIN = 'admin',
    VENDEDOR = 'vendedor',
}
export class CreateUsuarioDto {

    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsNotEmpty()
    apellido: string;

    @IsString()
    @IsNotEmpty()
    correo: string;

    @IsString()
    @IsNotEmpty()
    
    password: string;

    @IsString()
    @IsNotEmpty()
    @IsEnum(Rol)
    rol: Rol;

}
