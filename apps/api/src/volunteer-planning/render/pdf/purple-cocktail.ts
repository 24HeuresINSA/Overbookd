import { Content } from 'pdfmake/interfaces';

export class PurpleCocktail {
  static generateBarmanWorkflow(): Content[] {
    const headerText =
      'PROCEDURE SIMPLIFIEE COCKTAIL PURPLE A DESTINATION DES BARMANS';
    const descriptionText =
      "Cocktail Purple : Cocktail Purple est un dispositif mis en place par l'association Purple Effect en milieu festif. Une victime de VHSS (violences et harcèlement sexistes et sexuels) a la possibilité de commander au bar de l’événement un cocktail purple, qui est un nom de code permettant de la mettre en sécurité et de prévenir les équipes de sécurité et de prévention.";
    const procedureSteps = [
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
          ' et prévient la personne la plus proche de lui ',
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
          " et lui explique qu'il y a une commande de cocktail purple.",
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
    ];
    const safetyInstructionsText = [
      'Si le BARMAN A ne se sent pas de rester seul avec la VICTIME, il peut demander à une autre personne de rester avec lui ou de le remplacer.',
      "Si le RESP BARMAN ou le BARMAN B ne se sentent pas d'aller dans la fosse, ils peuvent prévenir le RESP BAR qui peut y aller à leur place.",
      "Dans la fosse, si vous êtes en contact avec l'AGRESSEUR, ne pas chercher à le confronter ou à le surveiller. L'objectif est de mettre la VICTIME à l'abri, le reste sera à la charge de la SECURITE.",
    ];
    const header = PurpleCocktail.generateHeader(headerText);
    const description = PurpleCocktail.generateDescription(descriptionText);
    const steps: Content = PurpleCocktail.generateSteps(procedureSteps);
    const safetyInstructions: Content =
      PurpleCocktail.generateSafetyInstructions(safetyInstructionsText);

    return [header, description, steps, safetyInstructions];
  }

  static generateLeaderWorkflow(): Content[] {
    const headerText =
      'PROCEDURE GENERALE COCKTAIL PURPLE A DESTINATION DES RESPS BARS, RESPS BARMANS';
    const descriptionText =
      "Cocktail Purple : Cocktail Purple est un dispositif mis en place par l'association Purple Effect en milieu festif. Une victime de VHSS (violences et harcèlement sexistes et sexuels) a la possibilité de commander au bar de l’événement un cocktail purple, qui est un nom de code permettant de la mettre en sécurité et de prévenir les équipes de sécurité et de prévention.";
    const procedureSteps = [
      {
        text: [
          'La ',
          { text: 'VICTIME', style: ['bold'] },
          ' se présente au bar et commande un cocktail purple au ',
          { text: 'BARMAN A', style: ['bold'] },
          ' un cocktail purple',
        ],
      },
      {
        text: [
          'Le ',
          { text: 'BARMAN A', style: ['bold'] },
          ' reste en contact avec la ',
          { text: 'VICTIME', style: ['bold'] },
          ' et prévient la personne la plus proche de lui ',
          { text: '(BARMAN B).', style: ['bold'] },
        ],
      },
      {
        text: [
          'Le ',
          { text: 'RESP BARMAN', style: ['bold'] },
          ' appelle par radio la ',
          { text: 'SECURITE', style: ['bold'] },
          ", informe qu'il y a une commande de cocktail purple et précise le nom du bar",
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
          { text: 'RESP BARMAN', style: ['bold'] },
          ' repère la position du ',
          { text: 'BARMAN A', style: ['bold'] },
          ' et de la ',
          { text: 'VICTIME', style: ['bold'] },
          ', se rend avec le ',
          { text: 'BARMAN B', style: ['bold'] },
          ' dans la fosse et prend contact avec la ',
          { text: 'VICTIME.', style: ['bold'] },
        ],
      },
      {
        text: [
          'La ',
          { text: 'SECURITE', style: ['bold'] },
          " prévient l'équipe mobile d'",
          { text: 'AGENTS DE SECURITE', style: ['bold'] },
          ' et la maraude de ',
          { text: 'PURPLE EFFECT', style: ['bold'] },
        ],
      },
      {
        text: [
          'Un des responsables ',
          { text: 'SECURITE', style: ['bold'] },
          " se rend sur place s'il est disponible ",
        ],
      },
      {
        text: [
          "Une équipe mobile d'",
          { text: 'AGENTS DE SECURITE', style: ['bold'] },
          ' se rend sur place.',
        ],
      },
      {
        text: [
          'Une maraude de ',
          { text: 'PURPLE EFFECT', style: ['bold'] },
          ' se rend sur place.',
        ],
      },
      {
        text: [
          'Le ',
          { text: 'RESP BARMAN', style: ['bold'] },
          ' accompagne la ',
          { text: 'VICTIME', style: ['bold'] },
          " derrière le bar. L'",
          { text: 'AGENT DE SECURITE', style: ['bold'] },
          " en charge de l'accès est au courant, en cas de difficulté pour passer, le ",
          { text: 'RESP BARMAN', style: ['bold'] },
          ' appelle par radio la ',
          { text: 'SECURITE', style: ['bold'] },
        ],
      },
      {
        text: [
          'Une fois la ',
          { text: 'VICTIME', style: ['bold'] },
          "  à l'abri, elle est prise en charge par l'équipe mobile d'",
          { text: 'AGENTS DE SECURITE', style: ['bold'] },
          ' et les bénévoles de ',
          { text: 'PURPLE EFFECT', style: ['bold'] },
          '. Au besoin, elle pourra être accompagnée à la safezone.',
        ],
      },
    ];
    const header = PurpleCocktail.generateHeader(headerText);
    const description = PurpleCocktail.generateDescription(descriptionText);
    const steps: Content = PurpleCocktail.generateSteps(procedureSteps);

    return [header, description, steps];
  }

  private static generateSafetyInstructions(
    safetyInstructionsText: string[],
  ): Content {
    return [
      {
        text: 'Consignes de sécurité:',
        style: ['paragraph', 'liteSpaceBetween'],
      },
      {
        ul: safetyInstructionsText,
        margin: [75, 0, 50, 5],
      },
    ];
  }

  private static generateSteps(
    procedureSteps: { text: (string | { text: string; style: string[] })[] }[],
  ): Content {
    return [
      { text: 'Procédure:', style: ['paragraph', 'liteSpaceBetween'] },
      {
        ol: procedureSteps,
        margin: [75, 0, 50, 5],
      },
    ];
  }

  private static generateDescription(descriptionText: string) {
    return {
      text: descriptionText,
      style: ['paragraph', 'largeSpaceBetween'],
    };
  }

  private static generateHeader(headerText: string) {
    return {
      text: headerText,
      style: ['header', 'bold'],
      pageBreak: 'before',
    };
  }
}
