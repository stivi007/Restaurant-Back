import { IsInt, IsPositive, IsString, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class AddToCartDto {
  @IsString()
  @IsNotEmpty({ message: 'El sesionId es requerido.' })
  sesionId: string;

  @IsInt()
  @IsPositive()
  productoId: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  cantidad?: number;
}

export class RemoveFromCartDto {
  @IsString()
  @IsNotEmpty({ message: 'El sesionId es requerido.' })
  sesionId: string;

  @IsInt()
  @IsPositive()
  productoId: number;
}