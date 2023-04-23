import { Assignment, Task, Volunteer } from '../domain/task.model';
import { RenderStrategy } from './renderStrategy';
import Printer from 'pdfmake';
import { join } from 'path';
import {
  formatDateToHumanReadable,
  formatDateWithHoursAndMinutesOnly,
} from 'src/utils/date';
import sanitizeHtml from 'sanitize-html';
import htmlToPdfMake from 'html-to-pdfmake';
import { Content, StyleDictionary } from 'pdfmake/interfaces';
import { JSDOM } from 'jsdom';
import { Period } from 'src/volunteer-availability/domain/period.model';
import { PurpleCocktail } from './pdf/purpleCocktail';

class PdfException extends Error {}

const { window } = new JSDOM();
const NB_ASSIGNEES_PER_LINE = 4;

export class PdfRenderStrategy implements RenderStrategy {
  private printer: Printer;

  private htmlToPdfDefaultStyle: StyleDictionary = {
    b: { bold: true },
    strong: { bold: true },
    u: { decoration: 'underline' },
    s: { decoration: 'lineThrough' },
    em: { italics: true },
    i: { italics: true },
    h1: { fontSize: 15, bold: true, marginBottom: 5 },
    h2: { fontSize: 14, bold: true, marginBottom: 5 },
    h3: { fontSize: 13, bold: true, marginBottom: 3 },
    h4: { fontSize: 12, bold: true, marginBottom: 3 },
    h5: { fontSize: 11, bold: true, marginBottom: 3 },
    h6: { fontSize: 10, bold: true, marginBottom: 3 },
    a: { color: 'blue', decoration: 'underline' },
    strike: { decoration: 'lineThrough' },
    p: { margin: [0, 3, 0, 3] },
    ul: { marginBottom: 3 },
    li: { marginLeft: 3 },
    table: { marginBottom: 3 },
    th: { bold: true, fillColor: '#EEEEEE' },
  };

  private pdfStyles: StyleDictionary = {
    bold: { bold: true },
    task: { fontSize: 20, bold: true, marginBottom: 5 },
    details: { fontSize: 14, marginBottom: 3 },
    period: { fontSize: 12, bold: true, marginBottom: 3, marginTop: 3 },
    header: {
      fontSize: 18,
      marginTop: 20,
      marginBottom: 20,
      marginLeft: 100,
      marginRight: 100,
      alignment: 'center',
    },
    paragraph: {
      fontSize: 10,
      marginLeft: 50,
      marginRight: 50,
    },
    liteSpaceBetween: { marginBottom: 3 },
    largeSpaceBetween: { marginBottom: 20 },
  };

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
    const pdf = this.printer.createPdfKitDocument({
      content: pdfContent,
      defaultStyle: { fontSize: 10 },
      styles: this.pdfStyles,
    });

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

  private generateContent(tasks: Task[]): Content[] {
    const assignments = tasks.flatMap((task) => this.generateTaskContent(task));
    const cocktailPurpleWorkflows = this.generatePurpleCocktailWorkflows();
    return [...assignments, ...cocktailPurpleWorkflows];
  }

  private generatePurpleCocktailWorkflows(): Content[] {
    return [
      ...PurpleCocktail.generateBarmanWorkflow(),
      ...PurpleCocktail.generateLeaderWorkflow(),
    ];
  }

  private generateTaskContent({
    name,
    period,
    location,
    description,
    assignments,
  }: Task): Content[] {
    const displayPeriod = this.extractPeriod(period);
    const displayLocation = this.extractLocation(location);
    const displayName = { text: name, style: ['task'] };
    const displayDescription = this.extractDescription(description);
    const displayAssignment = this.extractAssignments(assignments);
    const taskSeparator: Content = { text: '', margin: [0, 0, 0, 15] };

    return [
      displayName,
      displayPeriod,
      displayLocation,
      displayDescription,
      displayAssignment,
      taskSeparator,
    ];
  }

  private extractAssignments(assignments: Assignment[]): Content {
    if (assignments.length === 0) return '';

    const header = { text: 'Affectés avec toi', style: ['header'] };
    const listing = assignments.map(({ period, volunteers }) => {
      const displayHours = this.extractHours(period);
      const displayVolunteers = this.extractVolunteers(volunteers);
      return [displayHours, displayVolunteers];
    });
    return [header, listing];
  }

  private extractVolunteers(volunteers: Volunteer[]) {
    const nbLines = Math.ceil(volunteers.length / NB_ASSIGNEES_PER_LINE);
    return Array(nbLines)
      .fill(null)
      .map((_, index) => this.generateDisplayedAssignees(volunteers, index));
  }

  private generateDisplayedAssignees(volunteers: Volunteer[], index: number) {
    const currentVolunteers = this.extractVolunteerSubset(volunteers, index);
    const columns = this.generateAssigneesColumns(currentVolunteers);
    return { columns };
  }

  private extractVolunteerSubset(volunteers: Volunteer[], index: number) {
    return volunteers
      .slice(NB_ASSIGNEES_PER_LINE * index, NB_ASSIGNEES_PER_LINE * (index + 1))
      .map(({ name }) => ({ text: name }));
  }

  private generateAssigneesColumns(currentLine: { text: string }[]) {
    const columnsDelta = NB_ASSIGNEES_PER_LINE - currentLine.length;
    const isColumnFull = columnsDelta === 0;

    if (isColumnFull) return currentLine;

    const lineFill = Array(columnsDelta).fill('');
    return [...currentLine, ...lineFill];
  }

  private extractHours(period: Period) {
    const start = formatDateWithHoursAndMinutesOnly(period.start);
    const end = formatDateWithHoursAndMinutesOnly(period.end);
    return { text: `${start} - ${end}`, style: ['period'] };
  }

  private extractLocation(location: string): Content {
    return {
      text: [
        { text: 'Lieu: ', style: ['details', 'bold'] },
        { text: location, style: ['details'] },
      ],
      margin: [0, 0, 0, 5],
    };
  }

  private extractPeriod(period: Period): Content {
    const start = formatDateToHumanReadable(period.start);
    const end = formatDateToHumanReadable(period.end);
    const displayPeriod = {
      text: [
        { text: 'Creneau: ', style: ['bold', 'details'] },
        { text: `${start} - ${end}`, style: ['details'] },
      ],
    };
    return displayPeriod;
  }

  private extractDescription(description: string): Content {
    const sanitizedDescription = sanitizeHtml(description);
    return htmlToPdfMake(sanitizedDescription, {
      window,
      defaultStyles: this.htmlToPdfDefaultStyle,
    });
  }
}
