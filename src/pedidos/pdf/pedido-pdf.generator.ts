// ─────────────────────────────────────────────────────────────────────────────
// Construye el PDF del ticket de cocina. Sin precios, sin datos del cliente.
// Formato angosto pensado para impresoras térmicas tipo ticketera.
// ─────────────────────────────────────────────────────────────────────────────

import * as PDFDocument from 'pdfkit';

interface ItemPedido {
  cantidad: number;
  producto: { nombre: string };
}

interface DatosPedido {
  numeroDelDia: number;
  fecha: Date;
  venta: {
    items: ItemPedido[];
  };
}

const ANCHO_TICKET = 226; // ancho aproximado de una ticketera térmica de 80mm

export function generarPedidoPdf(data: DatosPedido): PDFKit.PDFDocument {
  const doc = new (PDFDocument as any)({
    size: [ANCHO_TICKET, 600],
    margin: 15,
  });

  dibujarEncabezado(doc, data);
  dibujarItems(doc, data.venta.items);

  doc.end();
  return doc;
}

function dibujarEncabezado(doc: PDFKit.PDFDocument, data: DatosPedido): void {
  doc
    .fontSize(20)
    .text(`PEDIDO #${data.numeroDelDia}`, { align: 'center' })
    .moveDown(0.3)
    .fontSize(9)
    .text(formatearFecha(data.fecha), { align: 'center' })
    .moveDown(0.5);

  dibujarLinea(doc);
}

function dibujarItems(doc: PDFKit.PDFDocument, items: ItemPedido[]): void {
  doc.moveDown(0.3);

  items.forEach((item) => {
    doc
      .fontSize(14)
      .text(`${item.cantidad}x  ${item.producto.nombre}`)
      .moveDown(0.4);
  });

  dibujarLinea(doc);
}

function dibujarLinea(doc: PDFKit.PDFDocument): void {
  doc.moveTo(15, doc.y).lineTo(ANCHO_TICKET - 15, doc.y).stroke();
  doc.moveDown(0.3);
}

function formatearFecha(fecha: Date): string {
  return new Date(fecha).toLocaleString('es-BO', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}