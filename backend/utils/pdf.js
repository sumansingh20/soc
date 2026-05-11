const escapePdfText = (value) => String(value).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');

export const buildTextPdf = ({ title, lines }) => {
  const contentLines = [
    'BT',
    '/F1 16 Tf',
    '72 760 Td',
    `(${escapePdfText(title)}) Tj`,
    '/F1 11 Tf',
    '0 -24 Td',
  ];

  lines.forEach((line, index) => {
    const prefix = index === 0 ? '' : '0 -16 Td ';
    contentLines.push(`${prefix}(${escapePdfText(line)}) Tj`);
  });
  contentLines.push('ET');

  const stream = contentLines.join('\n');
  const pdf = [
    '%PDF-1.4',
    '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj',
    '2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj',
    '3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj',
    '4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj',
    `5 0 obj << /Length ${stream.length} >> stream\n${stream}\nendstream endobj`,
    'xref',
    '0 6',
    '0000000000 65535 f ',
    '0000000010 00000 n ',
    '0000000060 00000 n ',
    '0000000117 00000 n ',
    '0000000252 00000 n ',
    '0000000316 00000 n ',
    'trailer << /Size 6 /Root 1 0 R >>',
    'startxref',
    '430',
    '%%EOF',
  ].join('\n');

  return Buffer.from(pdf);
};