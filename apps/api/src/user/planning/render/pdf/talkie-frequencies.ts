import { HARD, VIEUX } from "@overbookd/team-constants";
import { Content } from "pdfmake/interfaces";

export class TalkieFrequencies {
  static generateWorkflow(teams: string[]): Content[] {
    const shouldDisplayAllFrequencies =
      teams.includes(HARD) || teams.includes(VIEUX);

    const headerText = "Guide des fréquences\n- 24 heures de l'INSA -";

    const baseFrequencies = [{ text: "1 : Général" }];
    const allFrequencies = [
      ...baseFrequencies,
      { text: "2 : Points d'accès véhicules" },
      { text: "3 : Sécurité (Organisateurs, Protection Civile, STAFF, S3SI)" },
      { text: "4 : Courses" },
      { text: "5 : Electriciens" },
      { text: "6 : Concerts" },
    ];
    const frequenciesToDisplay = shouldDisplayAllFrequencies
      ? allFrequencies
      : baseFrequencies;

    const emergencyFrequencies = [
      { text: "Si coupure de courant (1-2-3-4 en panne) :" },
      { text: "5 : Sécurité" },
      { text: "6 : Général" },
    ];
    const doNotUseOtherFrequencies = [
      { text: "Veuillez ne pas utiliser les autres fréquences." },
    ];
    const otherFrequencies = shouldDisplayAllFrequencies
      ? emergencyFrequencies
      : doNotUseOtherFrequencies;

    const header = TalkieFrequencies.generateHeader(headerText);
    const frequencies: Content[] =
      TalkieFrequencies.generateFrequencies(frequenciesToDisplay);
    const otherFrequenciesContent =
      TalkieFrequencies.generateOtherFrequencies(otherFrequencies);
    const pageBreak: Content = { text: "", pageBreak: "after" };

    return [header, ...frequencies, ...otherFrequenciesContent, pageBreak];
  }

  private static generateFrequencies(
    frequencies: { text: string }[],
  ): Content[] {
    const style = ["frequency"];
    const margin: [number, number, number, number] = [75, 20, 50, 5];
    return frequencies.map(({ text }): Content => ({ text, style, margin }));
  }

  private static generateOtherFrequencies(
    otherFrequencies: { text: string }[],
  ): Content[] {
    const style = ["otherFrequency"];
    const margin: [number, number, number, number] = [75, 20, 50, 5];
    return otherFrequencies.map(
      ({ text }): Content => ({ text, style, margin }),
    );
  }

  private static generateHeader(headerText: string): Content {
    return {
      text: headerText,
      style: ["header", "bold"],
    };
  }
}
