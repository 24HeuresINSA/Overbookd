import { Content } from "pdfmake/interfaces";

export class FiveDMethod {
  static generateWorkflow(): Content[] {
    const headerText = "Méthode des 5D\n- 24h de l’INSA -";
    const descriptionText = [
      "La méthode des 5D est une approche simple et efficace pour aider quelqu'un et intervenir en toute sécurité si on est témoin d'une situation d'agression ou de harcèlement. Chaque D corespond à une méthode qu'il est possible d'utiliser si l'on est témoin de ce type de situation. Il est important de se rappeler que la sécurité de la personne qui aide est primordiale.",
    ];
    const methodTexts = [
      {
        text: [
          { text: "DISTRAIRE", style: ["bold"] },
          " : agir de manière indirecte pour éviter que la situation ne dégénère en commençant une conversation avec la victime ou en trouvant un autre moyen de détourner l’attention de l’harceleur·se. Faire semblant de connaître la victime, lui demander l’heure ou son chemin, faire tomber quelque chose de façon faussement accidentelle... N'importe quoi qui pourrait distraire l'agresseur·se.",
        ],
      },
      {
        text: [
          { text: "DÉLÉGUER", style: ["bold"] },
          " : il s’agit de repérer une personne représentant l’autorité et de demander de l’aide. Expliquer à cette personne ce qu’il s’est passé et lui demander si elle peut faire quelque chose. Il est aussi possible de déléguer à une personne lambda, ou de demander de l’aide autour de soi en parlant très fort pour attirer l’attention sur la situation.",
        ],
      },
      {
        text: [
          { text: "DOCUMENTER", style: ["bold"] },
          " : attention, cette méthode peut être dangereuse à appliquer, que ce soit pour votre sécurité ou celle de la victime. Il s’agit de filmer l’incident ou de prendre des photos, ce qui peut s’avérer très utile si la victime décide de porter plainte et souhaite apporter des preuves. Si vous souhaitez adopter cette technique, ne pas oublier de se tenir à une certaine distance de sécurité, d’énoncer la date et l’heure à voix haute et de filmer les panneaux de signalisation ou tout autre indice qui permette de repérer le lieu et le moment du délit. Attention cependant aux questions de droit à l’image. Il est interdit de publier des vidéos ou des photos sur les réseaux sociaux sans l’accord de la personne sur l’image.",
        ],
      },
      {
        text: [
          { text: "DIRIGER", style: ["bold"] },
          " : il s’agit tout simplement de prendre en main la situation, après avoir au préalable évalué sa propre sécurité, car c’est le “D” le plus dangereux. En dernier recours, demander à l’harceleur·se d’arrêter, intervenir, défendre la cible, demander de l’aide tout en évitant de se confronter directement à l’harceleur·se ou de s’exposer au danger.",
        ],
      },
      {
        text: [
          { text: "DIALOGUER", style: ["bold"] },
          " : dès que l’incident est terminé (et même si l’harceleur·se est toujours présent), faire le point calmement avec la personne harcelée pour la rassurer (“Puis-je m’asseoir à côté de toi ? Veux-tu que je demande de l’aide ? Veux-tu partir d’ici ?”). Indiquer que l’attitude de l’agressseur·se est interdite par la loi, qu’iel n’avait pas à faire ça, que c’est uniquement de sa faute et pas celle de la victime; agir comme un·e ami·e, sans être intrusif. Éviter de parler avec l’agresseur·se car la création d’un débat peut entraîner une possible violence.",
        ],
      },
    ];
    const sourceLinkText = "handsaway.fr/temoin-harcelement-agir";

    const header = this.generateHeader(headerText);
    const description = this.generateDescription(descriptionText);
    const method = this.generateMethod(methodTexts);
    const source = this.generateSource(sourceLinkText);
    return [header, description, method, source];
  }

  private static generateSource(sourceText: string): Content {
    return {
      text: [
        { text: "Source : ", style: ["liteSpaceBetween"] },
        {
          text: sourceText,
          style: ["liteSpaceBetween", "link"],
          link: `https://${sourceText}`,
        },
      ],
      alignment: "center",
    };
  }

  private static generateMethod(
    methodText: { text: (string | { text: string; style: string[] })[] }[],
  ): Content {
    return [
      {
        text: "Méthodes :",
        style: ["paragraph", "liteSpaceBetween"],
      },
      {
        ol: methodText,
        style: ["paragraph", "liteSpaceBetween"],
        margin: [75, 0, 50, 25],
        alignment: "justify",
      },
    ];
  }

  private static generateDescription(descriptionText: string[]): Content {
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
