import {
  Injectable,
  OnModuleInit,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { PrismaClient } from '../../generated/prisma';

@Injectable()
export class ProductosService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async create(createProductoDto: CreateProductoDto) {
    const { nombre } = createProductoDto;
    const existe = await this.producto.findUnique({ where: { nombre } });
    if (existe) {
      throw new ConflictException(
        `El producto con nombre ${nombre} ya está registrado`,
      );
    }
    return this.producto.create({ data: createProductoDto });
  }

  async findAll() {
    return this.producto.findMany();
  }

  async findOne(id: number) {
    const producto = await this.producto.findUnique({ where: { id } });
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return producto;
  }

  async update(id: number, updateProductoDto: UpdateProductoDto) {
    await this.findOne(id);

    if (updateProductoDto.nombre) {
      const existeNombre = await this.producto.findUnique({
        where: { nombre: updateProductoDto.nombre },
      });
      if (existeNombre && existeNombre.id !== id) {
        throw new ConflictException(
          `El producto con nombre ${updateProductoDto.nombre} ya existe`,
        );
      }
    }

    return this.producto.update({
      where: { id },
      data: updateProductoDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.producto.delete({ where: { id } });
  }

  async activate(id: number) {
    await this.findOne(id);
    return this.producto.update({
      where: { id },
      data: { activo: true },
    });
  }
}
