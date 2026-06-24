import { Module } from '@nestjs/common';
import { ComprobantesController } from './comprobantes.controller';
import { ComprobantesService } from './comprobantes.service';
import { ComprobantesRepository } from './comprobantes.repository';

@Module({
  controllers: [ComprobantesController],
  providers:   [ComprobantesService, ComprobantesRepository],
})
export class ComprobantesModule {}