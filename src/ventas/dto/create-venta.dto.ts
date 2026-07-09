import { IsArray, IsInt, IsPositive, ValidateNested, ArrayMinSize, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

import { TipoEntrega } from '../../../generated/prisma';
export class ItemVentaDto {
  @IsInt()
  @IsPositive()
  productoId: number;

  @IsInt()
  @IsPositive()
  cantidad: number;
}

export class CreateVentaDto {
  @IsArray()
  @ArrayMinSize(1, { message: 'La venta debe tener al menos un producto.' })
  @ValidateNested({ each: true })
  @Type(() => ItemVentaDto)
  items: ItemVentaDto[];

  @IsEnum(TipoEntrega, {
    message: 'El tipo de entrega debe ser MESA o LLEVAR.',
  })
  tipoEntrega: TipoEntrega;
}