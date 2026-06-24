import { IsEnum } from 'class-validator';
import { EstadoVenta } from '../../../generated/prisma';

export class ActualizarEstadoVentaDto {
  @IsEnum(EstadoVenta, {
    message: 'El estado debe ser PENDIENTE, PAGADA o CANCELADA.',
  })
  estado: EstadoVenta;
}