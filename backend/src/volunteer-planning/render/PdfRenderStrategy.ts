import { Task } from '../domain/task.model';
import { RenderStrategy } from './renderStrategy';
import Printer from 'pdfmake';
import { join } from 'path';
import { formatDateWithMinutes } from 'src/utils/date';
import sanitizeHtml from 'sanitize-html';

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
    const pdfContent = this.generateContent(tasks);
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
  generateContent(tasks: Task[]): string[] {
    return tasks.flatMap((task) => this.generateTaskContent(task));
  }

  generateTaskContent({ name, period, location, description }: Task): string[] {
    const start = formatDateWithMinutes(period.start);
    const end = formatDateWithMinutes(period.end);
    const displayPeriod = `De ${start} A ${end}`;

    const displayDescription = this.extractDescription(description);
    const taskSeparator = '\n\n\n';

    return [name, displayPeriod, location, displayDescription, taskSeparator];
  }

  private extractDescription(description: string) {
    const newLineTagRegex = new RegExp('</p>|<br>', 'g');
    const headerRegex = new RegExp('</h[1-6]>', 'g');
    const inferiorRegex = new RegExp('&lt;', 'g');
    const superiorRegex = new RegExp('&gt;', 'g');

    return sanitizeHtml(
      description
        .replace(newLineTagRegex, '$&\n')
        .replace(headerRegex, '$&\n\n'),
      {
        allowedTags: [],
      },
    )
      .replace(inferiorRegex, '<')
      .replace(superiorRegex, '>');
  }
}
