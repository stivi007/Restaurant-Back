import { IsString, IsNotEmpty, IsInt, IsPositive, IsOptional, IsEnum } from 'class-validator';
import { TipoEntrega } from '../../../generated/prisma';

export class CrearDesdeCarritoDto {
  @IsString()
  @IsNotEmpty({ message: 'El sesionId es requerido.' })
  sesionId: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  clienteId?: number;

  @IsEnum(TipoEntrega, {
    message: 'El tipo de entrega debe ser MESA o LLEVAR.',
  })
  tipoEntrega: TipoEntrega;
}