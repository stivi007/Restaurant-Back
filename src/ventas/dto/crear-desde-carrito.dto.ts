import { IsString, IsNotEmpty, IsInt, IsPositive, IsOptional } from 'class-validator';

export class CrearDesdeCarritoDto {
  @IsString()
  @IsNotEmpty({ message: 'El sesionId es requerido.' })
  sesionId: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  clienteId?: number;
}