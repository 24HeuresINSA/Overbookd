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
    header: { fontSize: 14, marginTop: 5 },
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
    const header =
      'PROCEDURE SIMPLIFIEE COCKTAIL PURPLE A DESTINATION DES BARMANS';
    const description =
      'Cocktail Purple : Cocktail Purple est un dispositif mis en place par l’association Purple Effect en milieu festif. Une victime de VHSS (violences et harcèlement sexistes et sexuels) a la possibilité de commander au bar de l’événement un cocktail purple, qui est un nom de code permettant de la mettre en sécurité et de prévenir les équipes de sécurité et de prévention.';
    const steps: Content = [
      'Procédure:',
      {
        ol: [
          {
            text: [
              'La ',
              { text: 'VICTIME', style: ['bold'] },
              ' se présente au bar et commande un cocktail purple au ',
              { text: 'BARMAN A(=TOI).', style: ['bold'] },
            ],
          },
          {
            text: [
              'Le ',
              { text: 'BARMAN A', style: ['bold'] },
              ' reste en contact avec la ',
              { text: 'VICTIME', style: ['bold'] },
              ' et prévient la personne la plus proche de lui',
              { text: '(BARMAN B(=UN AUTRE BÉNÉVOLE)).', style: ['bold'] },
            ],
          },
          {
            text: [
              'Le ',
              { text: 'BARMAN B', style: ['bold'] },
              ' va chercher le ',
              {
                text: 'RESP BARMAN (CASQUETTE NOIRE NINKASI)',
                style: ['bold'],
              },
              ' et lui explique qu’il y a une commande de cocktail purple.',
            ],
          },
          {
            text: [
              'Le ',
              { text: 'BARMAN B', style: ['bold'] },
              ' et le ',
              { text: 'RESP BARMAN', style: ['bold'] },
              ' se rendent dans la fosse pour aller à la rencontre de la ',
              { text: 'VICTIME.', style: ['bold'] },
            ],
          },
        ],
        margin: [0, 0, 0, 5],
      },
    ];
    const safetyInstructions: Content = [
      'Consignes de sécurité:',
      {
        ul: [
          'Si le BARMAN A ne se sent pas de rester seul avec la VICTIME, il peut demander à une autre personne de rester avec lui ou de le remplacer.',
          "Si le RESP BARMAN ou le BARMAN B ne se sentent pas d'aller dans la fosse, ils peuvent prévenir le RESP BAR qui peut y aller à leur place.",
          "Dans la fosse, si vous êtes en contact avec l'AGRESSEUR, ne pas chercher à le confronter ou à le surveiller. L'objectif est de mettre la VICTIME à l'abri, le reste sera à la charge de la SECURITE.",
        ],
        margin: [0, 0, 0, 5],
      },
    ];
    return [header, description, steps, safetyInstructions];
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
