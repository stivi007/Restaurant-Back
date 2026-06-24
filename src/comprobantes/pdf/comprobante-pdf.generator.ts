// ─────────────────────────────────────────────────────────────────────────────
// Construye el PDF del comprobante. No toca la base de datos, solo dibuja
// con los datos que recibe.
// ─────────────────────────────────────────────────────────────────────────────

import * as PDFDocument from 'pdfkit';

interface ItemComprobante {
  cantidad: number;
  precioUnit: number | { toString(): string };
  producto: { nombre: string };
}

interface DatosComprobante {
  numero: string;
  emitidoEn: Date;
  venta: {
    subtotal: number | { toString(): string };
    impuesto: number | { toString(): string };
    total: number | { toString(): string };
    cliente: { nombre: string; apellido: string; ci: string } | null;
    items: ItemComprobante[];
  };
}
export function generarComprobantePdf(data: DatosComprobante): PDFKit.PDFDocument {
  const doc = new (PDFDocument as any)({ size: 'A4', margin: 50 });

  dibujarEncabezado(doc, data);
  dibujarDatosCliente(doc, data);
  dibujarTablaProductos(doc, data.venta.items);
  dibujarTotales(doc, data.venta);

  doc.end();
  return doc;
}

function dibujarEncabezado(doc: PDFKit.PDFDocument, data: DatosComprobante): void {
  doc
    .fontSize(18)
    .text('RESTAURANTE ?', { align: 'center' })
    .moveDown(0.5)
    .fontSize(12)
    .text(`Comprobante: ${data.numero}`, { align: 'center' })
    .text(`Fecha: ${formatearFecha(data.emitidoEn)}`, { align: 'center' })
    .moveDown(1);
}

function dibujarDatosCliente(doc: PDFKit.PDFDocument, data: DatosComprobante): void {
  const cliente = data.venta.cliente;
  const texto = cliente
    ? `Cliente: ${cliente.nombre} ${cliente.apellido} (CI: ${cliente.ci})`
    : 'Cliente: Anónimo';

  doc.fontSize(10).text(texto).moveDown(1);
}

function dibujarTablaProductos(doc: PDFKit.PDFDocument, items: ItemComprobante[]): void {
  const Y_INICIAL = doc.y;
  const COL = { producto: 50, cantidad: 270, precio: 330, subtotal: 420 };

  doc.fontSize(10);
  doc.text('Producto', COL.producto, Y_INICIAL);
  doc.text('Cant.',    COL.cantidad, Y_INICIAL, { width: 50, align: 'right' });
  doc.text('Precio',   COL.precio,   Y_INICIAL, { width: 70, align: 'right' });
  doc.text('Subtotal', COL.subtotal, Y_INICIAL, { width: 80, align: 'right' });

  doc.moveDown(0.8);
  dibujarLinea(doc);
  doc.moveDown(0.3);

  items.forEach((item) => {
    const precioUnit   = Number(item.precioUnit);
    const subtotalItem = precioUnit * item.cantidad;
    const filaY         = doc.y;

    doc.text(item.producto.nombre, COL.producto, filaY, { width: 200 });
    doc.text(String(item.cantidad), COL.cantidad, filaY, { width: 50, align: 'right' });
    doc.text(precioUnit.toFixed(2), COL.precio, filaY, { width: 70, align: 'right' });
    doc.text(subtotalItem.toFixed(2), COL.subtotal, filaY, { width: 80, align: 'right' });

    doc.moveDown(0.6);
  });

  dibujarLinea(doc);
}

function dibujarTotales(doc: PDFKit.PDFDocument, venta: DatosComprobante['venta']): void {
  const subtotal = Number(venta.subtotal);
  const impuesto = Number(venta.impuesto);
  const total    = Number(venta.total);

  doc.moveDown(0.5);
  doc.fontSize(10).text(`Subtotal: ${subtotal.toFixed(2)}`, { align: 'right' });
  doc.text(`Impuesto: ${impuesto.toFixed(2)}`, { align: 'right' });
  doc.fontSize(12).text(`TOTAL: ${total.toFixed(2)}`, { align: 'right' });
}

function dibujarLinea(doc: PDFKit.PDFDocument): void {
  doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
  doc.moveDown(0.3);
}

function formatearFecha(fecha: Date): string {
  return new Date(fecha).toLocaleString('es-BO', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}