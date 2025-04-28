import { join } from "path";
import { Content } from "pdfmake/interfaces";

export class PurpleCocktail {
  static generateWorkflow(): Content[] {
    const headerText = "Procédure Cocktail Purple\n- 24h de l’INSA -";
    const descriptionText = {
      text: [
        "L'objectif principal de ce protocole est de fournir un moyen sûr et discret pour que toute personne se sentant en danger ou mal à l'aise puisse signaler sa situation et recevoir de l'aide immédiatement. Ce système vise à prévenir et à intervenir rapidement dans les ",
        { text: "situations d'agression ou de harcèlement", style: ["bold"] },
        ".",
      ],
    };
    const procedureSteps = [
      {
        text: [
          { text: "Signalement", style: ["bold"] },
          " : la ",
          { text: "VICTIME", style: ["bold"] },
          " commande un cocktail purple au ",
          { text: "BARMAN A", style: ["bold"] },
          " qui informe le ",
          { text: "BARMAN B", style: ["bold"] },
          " tout en RESTANT EN CONTACT avec la ",
          { text: "VICTIME", style: ["bold"] },
          ".",
        ],
      },
      {
        text: [
          { text: "Alerte", style: ["bold"] },
          " : le ",
          { text: "BARMAN B", style: ["bold"] },
          " prévient le ",
          {
            text: "RESP BARMAN",
            style: ["bold"],
          },
          "qui alerte la ",
          { text: "SÉCURITÉ", style: ["bold"] },
          " par talkie en précisant le nom du bar.",
        ],
      },
      {
        text: [
          { text: "Intervention", style: ["bold"] },
          " : en attendant l'arrivée de la ",
          { text: "SÉCURITÉ", style: ["bold"] },
          " ou de ",
          { text: "PURPLE EFFECT", style: ["bold"] },
          ", le ",
          { text: "RESP BARMAN", style: ["bold"] },
          " et le ",
          { text: "BARMAN B", style: ["bold"] },
          " rejoignent la ",
          { text: "VICTIME", style: ["bold"] },
          ".",
        ],
      },
      {
        text: [
          { text: "Mise en sécurité", style: ["bold"] },
          " : le ",
          { text: "RESP BARMAN", style: ["bold"] },
          " accompagne la ",
          { text: "VICTIME", style: ["bold"] },
          " derrière le bar. En cas de difficulté, le ",
          { text: "RESP BARMAN", style: ["bold"] },
          " alerte de nouveau la ",
          { text: "SÉCURITÉ", style: ["bold"] },
          " par talkie.",
        ],
      },
      {
        text: [
          { text: "Prise en charge", style: ["bold"] },
          " : la",
          { text: "VICTIME", style: ["bold"] },
          "  est confiée à la ",
          { text: "SÉCURITÉ", style: ["bold"] },
          " et à ",
          { text: "PURPLE EFFECT", style: ["bold"] },
          ". Au besoin, elle pourra être accompagnée à la safezone.",
        ],
      },
    ];
    const procedureDiagramImagePath = "/assets/purple_cocktail_diagram.png";
    const safetyInstructionsText = [
      "Si le BARMAN A ne se sent pas de rester seul avec la VICTIME, il peut demander à une autre personne de rester avec lui ou de le remplacer.",
      "Si le RESP BARMAN ou le BARMAN B ne se sentent pas d'aller dans la fosse, ils peuvent prévenir le RESP BAR qui peut y aller à leur place.",
      "Si vous allez dans la fosse et que vous êtes en contact avec l’AGRESSEUR, ne cherchez pas à le confronter ou à le surveiller. L’objectif est de mettre la VICTIME à l’abri, le reste sera à la charge de la SÉCURITÉ.",
    ];
    const header = PurpleCocktail.generateHeader(headerText);
    const description = PurpleCocktail.generateDescription(descriptionText);
    const steps: Content = PurpleCocktail.generateSteps(procedureSteps);
    const procedureDiagram = PurpleCocktail.generateDiagram(
      procedureDiagramImagePath,
    );
    const safetyInstructions: Content =
      PurpleCocktail.generateSafetyInstructions(safetyInstructionsText);

    return [header, description, steps, procedureDiagram, safetyInstructions];
  }

  private static generateSafetyInstructions(
    safetyInstructionsText: string[],
  ): Content {
    return [
      {
        text: "Consignes de sécurité :",
        style: ["paragraph", "liteSpaceBetween"],
      },
      {
        ul: safetyInstructionsText,
        style: ["paragraph", "liteSpaceBetween"],
        margin: [75, 0, 50, 5],
        alignment: "justify",
      },
    ];
  }

  private static generateDiagram(imagePath: string): Content {
    return {
      image: join(__dirname, "../../../../..", imagePath),
      fit: [400, 400],
      style: {
        alignment: "center",
      },
      margin: [0, 10, 0, 40],
    };
  }

  private static generateSteps(
    procedureSteps: { text: (string | { text: string; style: string[] })[] }[],
  ): Content {
    return [
      {
        text: "Procédure :",
        style: ["paragraph", "liteSpaceBetween"],
      },
      {
        ol: procedureSteps,
        style: ["paragraph", "liteSpaceBetween"],
        margin: [75, 0, 50, 5],
        alignment: "justify",
      },
    ];
  }

  private static generateDescription(descriptionText: {
    text: (string | { text: string; style: string[] })[];
  }): Content {
    return {
      text: descriptionText,
      style: ["paragraph", "largeSpaceBetween"],
      margin: [50, 0, 50, 20],
      alignment: "justify",
    };
  }

  private static generateHeader(headerText: string): Content {
    return {
      text: headerText,
      style: ["header", "bold"],
      pageBreak: "before",
    };
  }
}
