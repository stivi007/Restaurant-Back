import { IsArray, IsInt, IsPositive, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

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
}