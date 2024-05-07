import { HARD_CODE, VIEUX_CODE } from "@overbookd/team";
import { Content } from "pdfmake/interfaces";

export class TalkieFrequencies {
  static generateWorkflow(teams: string[]): Content[] {
    const shouldDisplayAllFrequencies =
      teams.includes(HARD_CODE) || teams.includes(VIEUX_CODE);

    const headerText = "Guide des fréquences - 24 heures de l'INSA";
    const baseFrequencies = [
      { text: "1 : Général" },
      { text: "2 : Points d'accès véhicules" },
    ];
    const allFrequencies = [
      ...baseFrequencies,
      { text: "3 : Sécurité (Organisateurs, Protection Civile, STAFF, SSSI)" },
      { text: "4 : Courses" },
      { text: "5 : Electriciens" },
      { text: "6 : Concerts" },
    ];
    const frequenciesToDisplay = shouldDisplayAllFrequencies
      ? allFrequencies
      : baseFrequencies;

    const header = TalkieFrequencies.generateHeader(headerText);
    const frequencies: Content[] =
      TalkieFrequencies.generateFrequencies(frequenciesToDisplay);

    return [header, ...frequencies];
  }

  private static generateFrequencies(
    frequencies: { text: string }[],
  ): Content[] {
    const style = ["frequency"];
    const margin = [75, 20, 50, 5];
    return frequencies.map(({ text }) => ({ text, style, margin }) as Content);
  }

  private static generateHeader(headerText: string): Content {
    return {
      text: headerText,
      style: ["header", "bold"],
      pageBreak: "before",
    };
  }
}
