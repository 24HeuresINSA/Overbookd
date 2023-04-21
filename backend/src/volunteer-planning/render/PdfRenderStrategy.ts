import { Task } from '../domain/task.model';
import { RenderStrategy } from './renderStrategy';
import Printer from 'pdfmake';
import { join } from 'path';

class PdfException extends Error {}

export class PdfRenderStrategy implements RenderStrategy {
  private printer: Printer;

  private fonts = {
    Roboto: {
      normal: join(__dirname, '../../..', '/fonts/Roboto-Regular.ttf'),
      bold: join(__dirname, '../../..', '/fonts/Roboto-Medium.ttf'),
      italics: join(__dirname, '../../..', '/fonts/Roboto-Italic.ttf'),
      bolditalics: join(
        __dirname,
        '../../..',
        '/fonts/Roboto-MediumItalic.ttf',
      ),
    },
  };

  constructor() {
    this.printer = new Printer(this.fonts);
  }

  render(tasks: Task[]): Promise<any> {
    const pdfContent = [
      'First paragraph',
      'Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines',
    ];
    const pdf = this.printer.createPdfKitDocument({ content: pdfContent });

    const chunks = [];
    return new Promise((resolve, reject) => {
      pdf.on('data', function (chunk) {
        chunks.push(chunk);
      });
      pdf.on('end', function () {
        const result = Buffer.concat(chunks);
        const base64Content = result.toString('base64');
        const encodedContent = `data:application/pdf;base64,${base64Content}`;
        resolve(encodedContent);
      });
      pdf.on('err', function (error) {
        reject(new PdfException(error));
      });
      pdf.end();
    });
  }
}
