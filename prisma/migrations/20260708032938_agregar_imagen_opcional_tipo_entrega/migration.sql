-- CreateEnum
CREATE TYPE "TipoEntrega" AS ENUM ('MESA', 'LLEVAR');

-- AlterTable
ALTER TABLE "Producto" ADD COLUMN     "imagenUrl" TEXT;

-- AlterTable
ALTER TABLE "Venta" ADD COLUMN     "tipoEntrega" "TipoEntrega" NOT NULL DEFAULT 'MESA';
