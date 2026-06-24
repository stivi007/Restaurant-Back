/*
  Warnings:

  - A unique constraint covering the columns `[ci]` on the table `Cliente` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ci` to the `Cliente` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cliente" ADD COLUMN     "ci" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Venta" ADD COLUMN     "clienteId" INTEGER;

-- CreateTable
CREATE TABLE "Comprobante" (
    "id" SERIAL NOT NULL,
    "numero" TEXT NOT NULL,
    "emitidoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ventaId" INTEGER NOT NULL,

    CONSTRAINT "Comprobante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pedido" (
    "id" SERIAL NOT NULL,
    "numeroDelDia" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ventaId" INTEGER NOT NULL,

    CONSTRAINT "Pedido_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Comprobante_numero_key" ON "Comprobante"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "Comprobante_ventaId_key" ON "Comprobante"("ventaId");

-- CreateIndex
CREATE UNIQUE INDEX "Pedido_ventaId_key" ON "Pedido"("ventaId");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_ci_key" ON "Cliente"("ci");

-- AddForeignKey
ALTER TABLE "Venta" ADD CONSTRAINT "Venta_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comprobante" ADD CONSTRAINT "Comprobante_ventaId_fkey" FOREIGN KEY ("ventaId") REFERENCES "Venta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_ventaId_fkey" FOREIGN KEY ("ventaId") REFERENCES "Venta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
