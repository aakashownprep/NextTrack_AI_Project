import fs from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import PDFDocument from 'pdfkit';
import { Document, Packer, Paragraph, HeadingLevel, TextRun, Footer, PageNumber, AlignmentType } from 'docx';

function cleanText(value) {
  return String(value ?? '').replace(/\r\n/g, '\n');
}

export async function makeDocx(proposal, outputPath) {
  const children = [
    new Paragraph({ text: 'NEXT TRACK ENGINEERING PVT. LTD.', heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER }),
    new Paragraph({ text: cleanText(proposal.title), heading: HeadingLevel.TITLE, alignment: AlignmentType.CENTER }),
    new Paragraph({ text: 'TECHNICAL & COMMERCIAL PROPOSAL', alignment: AlignmentType.CENTER }),
    new Paragraph({ text: 'DRAFT FOR REVIEW', alignment: AlignmentType.CENTER }),
    new Paragraph({ text: '' })
  ];

  for (const section of proposal.sections || []) {
    children.push(new Paragraph({ text: cleanText(section.heading), heading: HeadingLevel.HEADING_1, keepNext: true }));
    const lines = cleanText(section.body).split('\n');
    for (const line of lines) {
      children.push(new Paragraph({
        children: [new TextRun({ text: line || ' ' })],
        spacing: { after: 100, line: 276 }
      }));
    }
  }

  const doc = new Document({
    creator: 'Next Track Engineering Pvt. Ltd.',
    title: cleanText(proposal.title || 'Technical & Commercial Proposal'),
    sections: [{
      properties: { page: { margin: { top: 900, right: 900, bottom: 900, left: 900 } } },
      children,
      footers: { default: new Footer({ children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun('Next Track Engineering Pvt. Ltd.  |  Page '), PageNumber.CURRENT]
      })] }) }
    }]
  });

  const buffer = await Packer.toBuffer(doc);
  await fs.writeFile(outputPath, buffer);
}

export async function makePdf(proposal, outputPath) {
  await new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margins: { top: 54, right: 52, bottom: 58, left: 52 }, autoFirstPage: true, bufferPages: true });
    const stream = createWriteStream(outputPath);
    stream.on('finish', resolve);
    stream.on('error', reject);
    doc.on('error', reject);
    doc.pipe(stream);

    doc.font('Helvetica-Bold').fontSize(15).fillColor('#17365D').text('NEXT TRACK ENGINEERING PVT. LTD.', { align: 'center' });
    doc.moveDown(1.2);
    doc.fontSize(19).fillColor('#172B4D').text(cleanText(proposal.title || 'Technical & Commercial Proposal'), { align: 'center' });
    doc.moveDown(0.6);
    doc.font('Helvetica').fontSize(9).fillColor('#667085').text('TECHNICAL & COMMERCIAL PROPOSAL  |  DRAFT FOR REVIEW', { align: 'center' });
    doc.moveDown(2);

    for (const section of proposal.sections || []) {
      if (doc.y > 700) doc.addPage();
      doc.moveDown(0.7);
      doc.font('Helvetica-Bold').fontSize(13).fillColor('#17365D').text(cleanText(section.heading));
      doc.moveDown(0.35);
      doc.font('Helvetica').fontSize(9.5).fillColor('#202939').text(cleanText(section.body), { align: 'left', lineGap: 3 });
    }

    const range = doc.bufferedPageRange();
    for (let i = range.start; i < range.start + range.count; i++) {
      doc.switchToPage(i);
      doc.font('Helvetica').fontSize(8).fillColor('#667085');
      doc.text(`Next Track Engineering Pvt. Ltd.  |  Page ${i + 1}`, 52, 780, { width: 490, align: 'center', lineBreak: false });
    }
    doc.end();
  });
}
