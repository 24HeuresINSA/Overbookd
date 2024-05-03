import Printer from "pdfmake";
import sanitizeHtml from "sanitize-html";
import htmlToPdfMake from "html-to-pdfmake";
import { join } from "path";
import { Content, StyleDictionary } from "pdfmake/interfaces";
import { JSDOM } from "jsdom";
import { IProvidePeriod } from "@overbookd/period";
import {
  formatDateToHumanReadable,
  formatDateWithHoursAndMinutesOnly,
} from "../../../utils/date";
import { Assignment, Contact, Task, Volunteer } from "../domain/task.model";
import { PurpleCocktail } from "./pdf/purple-cocktail";
import { SecurityPlan } from "./pdf/security-plan";
import { Introduction } from "./pdf/introduction";
import { RenderStrategy } from "./render-strategy";
import { Edition } from "@overbookd/contribution";
import { updateItemToList } from "@overbookd/list";

class PdfException extends Error {}

const { window } = new JSDOM();
const NB_ASSIGNEES_PER_LINE = 4;
const NB_CONTACTS_PER_LINE = 3;
const MAX_LINES = 5;
const SECURITY_PLAN_PAGE = 2;

export class PdfRenderStrategy implements RenderStrategy {
  private printer: Printer;

  private htmlToPdfDefaultStyle: StyleDictionary = {
    b: { bold: true },
    strong: { bold: true },
    u: { decoration: "underline" },
    s: { decoration: "lineThrough" },
    em: { italics: true },
    i: { italics: true },
    h1: { fontSize: 15, bold: true, marginBottom: 5 },
    h2: { fontSize: 14, bold: true, marginBottom: 5 },
    h3: { fontSize: 13, bold: true, marginBottom: 3 },
    h4: { fontSize: 12, bold: true, marginBottom: 3 },
    h5: { fontSize: 11, bold: true, marginBottom: 3 },
    h6: { fontSize: 10, bold: true, marginBottom: 3 },
    a: { color: "blue", decoration: "underline" },
    strike: { decoration: "lineThrough" },
    p: { margin: [0, 3, 0, 3] },
    ul: { marginBottom: 3 },
    li: { marginLeft: 3 },
    table: { marginBottom: 3 },
    th: { bold: true, fillColor: "#EEEEEE" },
  };

  private pdfStyles: StyleDictionary = {
    bold: { bold: true },
    task: { fontSize: 20, bold: true, marginBottom: 5 },
    details: { fontSize: 14, marginBottom: 3 },
    period: { fontSize: 12, bold: true, marginBottom: 3, marginTop: 3 },
    contact: { fontSize: 14, bold: true, marginTop: 5 },
    assign: { fontSize: 14, marginTop: 10 },
    header: {
      fontSize: 18,
      marginTop: 20,
      marginBottom: 20,
      marginLeft: 100,
      marginRight: 100,
      alignment: "center",
    },
    paragraph: {
      fontSize: 10,
      marginLeft: 50,
      marginRight: 50,
    },
    liteSpaceBetween: { marginBottom: 3 },
    largeSpaceBetween: { marginBottom: 20 },
    edition: { fontSize: 12, marginBottom: 10, marginTop: 10 },
    volunteer: { fontSize: 22 },
  };

  private fonts = {
    Roboto: {
      normal: join(__dirname, "../../../..", "/fonts/Roboto-Regular.ttf"),
      bold: join(__dirname, "../../../..", "/fonts/Roboto-Medium.ttf"),
      italics: join(__dirname, "../../../..", "/fonts/Roboto-Italic.ttf"),
      bolditalics: join(
        __dirname,
        "../../../..",
        "/fonts/Roboto-MediumItalic.ttf",
      ),
    },
  };

  constructor() {
    this.printer = new Printer(this.fonts);
  }

  render(tasks: Task[], volunteer: Volunteer): Promise<unknown> {
    const pdfContent = this.generateContent(tasks);
    const header = this.generateHeader(volunteer);
    const footer = this.generateFooter();
    const info = this.generateMetadata(volunteer);

    const pdf = this.printer.createPdfKitDocument({
      info,
      header,
      footer,
      content: pdfContent,
      defaultStyle: { fontSize: 10 },
      styles: this.pdfStyles,
      pageMargins: [40, 80, 40, 80],
    });

    const chunks = [];
    return new Promise((resolve, reject) => {
      pdf.on("data", function (chunk) {
        chunks.push(chunk);
      });
      pdf.on("end", function () {
        const result = Buffer.concat(chunks);
        resolve(result.toString("base64"));
      });
      pdf.on("err", function (error) {
        reject(new PdfException(error));
      });
      pdf.end();
    });
  }

  private generateMetadata(volunteer: Volunteer) {
    return {
      title: `Livret ${volunteer.name}`,
      author: "overbookd",
      suject: "livret bénévole 24 heures de l'INSA",
      creator: "overbookd",
      producer: "overbookd",
    };
  }

  private generateFooter() {
    return function (currentPage: number): Content {
      return {
        columns: [
          {
            stack: [
              { text: "Responsables Bénévoles", style: ["bold"] },
              "Mathilde : 06 44 36 92 99",
              "Aglaé : 06 27 52 10 99",
              "Jérémy : 06 21 67 72 82",
            ],
            width: 150,
          },
          {
            stack: [
              { text: "PC Sécurité", style: ["bold"] },
              "Principal: 04 28 29 22 11",
              "Secondaire: 04 72 43 70 70",
            ],
            width: 150,
          },

          {
            text: `- ${currentPage.toString()}`,
            style: ["bold"],
            alignment: "right",
            marginTop: 40,
          },
        ],
        margin: [20, 20, 20, 0],
      };
    };
  }

  private generateHeader(volunteer: Volunteer) {
    return function (currentPage: number): Content {
      const headerTitle =
        currentPage === SECURITY_PLAN_PAGE ? "Plan Sécu" : volunteer.name;
      return {
        columns: [
          {
            image: join(__dirname, "../../../..", "/assets/logo_24h.png"),
            fit: [50, 50],
            width: 50,
            margin: [20, 15],
          },
          {
            stack: [
              {
                text: `24 heures de l'INSA - ${Edition.current}ème édition`,
                alignment: "center",
                style: ["edition"],
              },
              {
                text: headerTitle,
                alignment: "center",
                style: ["volunteer", "bold"],
              },
            ],
          },
          {
            text: "",
            width: 50,
          },
        ],
      };
    };
  }

  private generateContent(tasks: Task[]): Content[] {
    const introductionPage = Introduction.generatePage();
    const securityPlan = SecurityPlan.generatePage();
    const assignments = tasks.flatMap((task) => this.generateTaskContent(task));
    const cocktailPurpleWorkflows = this.generatePurpleCocktailWorkflows();
    return [
      introductionPage,
      securityPlan,
      ...assignments,
      ...cocktailPurpleWorkflows,
    ];
  }

  private generatePurpleCocktailWorkflows(): Content[] {
    return [...PurpleCocktail.generateWorkflow()];
  }

  private generateTaskContent({
    name,
    period,
    location,
    instructions,
    assignments,
    contacts,
  }: Task): Content[] {
    const displayPeriod = this.extractPeriod(period);
    const displayLocation = this.extractLocation(location);
    const displayName = { text: name, style: ["task"] };
    const displayInstructions = this.extractInstructions(instructions);
    const displayContacts = this.extractContacts(contacts);
    const displayAssignment = this.extractAssignments(assignments);
    const taskSeparator: Content = {
      table: {
        widths: ["*"],
        body: [[{ text: "", fillColor: "#000" }]],
      },
      margin: [0, 5, 0, 15],
    };

    return [
      displayName,
      displayPeriod,
      displayLocation,
      displayInstructions,
      displayContacts,
      displayAssignment,
      taskSeparator,
    ];
  }

  private extractAssignments(assignments: Assignment[]): Content {
    if (assignments.length === 0) return "";

    const header = { text: "Affectés avec toi", style: ["assign"] };
    const listing = assignments.map(({ period, volunteers }) => {
      const displayHours = this.extractHours(period);
      const displayVolunteers = this.extractVolunteers(volunteers);
      return [displayHours, displayVolunteers];
    });
    return [header, listing];
  }

  private extractVolunteers(volunteers: Volunteer[]) {
    const nbLines = Math.min(
      Math.ceil(volunteers.length / NB_ASSIGNEES_PER_LINE),
      MAX_LINES,
    );
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
      .map(({ name }, columnIndex) => {
        const shouldDisplayEllipsis = this.shouldDisplayEllipsis(
          index,
          volunteers.length,
          columnIndex,
        );
        const text = shouldDisplayEllipsis ? "..." : name;
        return { text };
      });
  }

  private extractContacts(contacts: Contact[]): Content {
    if (contacts.length === 0) return "";

    const header = {
      text: "Peronnes à contacter en cas de problème",
      style: ["contact"],
    };
    const listing = contacts
      .reduce((rows, { name, phone }) => {
        const previousRow = rows.at(-1);
        const contact = { text: `${name} (${phone})` };
        if (!previousRow) return [[contact]];
        if (previousRow.length === NB_CONTACTS_PER_LINE)
          return [...rows, [contact]];
        return updateItemToList(rows, -1, [...previousRow, contact]);
      }, [])
      .map((row) => ({ columns: row }));

    return [header, listing];
  }

  shouldDisplayEllipsis(
    lineIndex: number,
    nbVolunteers: number,
    columnIndex: number,
  ): boolean {
    const isLastLine = lineIndex === MAX_LINES - 1;
    const maxVolunteers = MAX_LINES * NB_ASSIGNEES_PER_LINE;
    const hasAtLeastMaxVolunteers = nbVolunteers > maxVolunteers;
    const isLastColumn = columnIndex === NB_ASSIGNEES_PER_LINE - 1;

    return hasAtLeastMaxVolunteers && isLastLine && isLastColumn;
  }

  private generateAssigneesColumns(currentLine: { text: string }[]) {
    const columnsDelta = NB_ASSIGNEES_PER_LINE - currentLine.length;
    const isColumnFull = columnsDelta === 0;

    if (isColumnFull) return currentLine;

    const lineFill = Array(columnsDelta).fill("");
    return [...currentLine, ...lineFill];
  }

  private extractHours(period: IProvidePeriod) {
    const start = formatDateWithHoursAndMinutesOnly(period.start);
    const end = formatDateWithHoursAndMinutesOnly(period.end);
    return { text: `${start} - ${end}`, style: ["period"] };
  }

  private extractLocation(location: string): Content {
    return {
      text: [
        { text: "Lieu: ", style: ["details", "bold"] },
        { text: location, style: ["details"] },
      ],
      margin: [0, 0, 0, 5],
    };
  }

  private extractPeriod(period: IProvidePeriod): Content {
    const start = formatDateToHumanReadable(period.start);
    const end = formatDateToHumanReadable(period.end);
    const displayPeriod = {
      text: [
        { text: "Creneau: ", style: ["bold", "details"] },
        { text: `${start} - ${end}`, style: ["details"] },
      ],
    };
    return displayPeriod;
  }

  private extractInstructions(instructions: string): Content {
    const sanitizedInstructions = sanitizeHtml(instructions);
    return htmlToPdfMake(sanitizedInstructions, {
      window,
      defaultStyles: this.htmlToPdfDefaultStyle,
    });
  }
}
