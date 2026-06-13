import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateAuthDto {

    @IsEmail()
    @IsNotEmpty()
    correo: string;
    @IsString()
    @IsNotEmpty()
    password: string;
}
