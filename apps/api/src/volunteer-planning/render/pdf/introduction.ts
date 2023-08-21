import { join } from "path";
import { Content } from "pdfmake/interfaces";

export class Introduction {
  static generatePage(): Content {
    return [
      {
        text: "Bienvenue dans l'aventure 24 heures de l'INSA !",
        style: ["paragraph", "bold", "liteSpaceBetween"],
      },
      {
        text: "Merci de rendre cet événement possible, vous êtes plus 400 à venir nous aider pour ce week-end de folie.",
        style: ["paragraph", "largeSpaceBetween"],
      },
      {
        text: "Tu trouveras dans ce livret l'essentiel des informations dont tu as besoin pour profiter et nous filer un coup de main avec:",
        style: ["paragraph"],
      },
      {
        ul: [
          "Le plan bénévole disponible sous forme de QR Code, il te permettra de trouver ton chemin en toutes circontances avec sa carte interactive",
          "Le plan sécu en page 2, il est là pour te donner une vision spécifique du site en soirée (où est-ce que tu peux rentrer, où sont les bars etc...)",
          "Un planning avec une liste de créneaux pendant lesquels on compte sur toi pour nous aider",
          "Un rappel du dispositif cocktail purple en toute fin de livret, ce dispositif vise à mettre à l'abri des personnes qui se sentent en danger sur le festival",
        ],
        style: ["paragraph", "liteSpaceBetween"],
        margin: [75, 0, 50, 5],
      },
      {
        text: "Lorsque tu as du temps libre n'hésite pas à passer au QG pour:",
        style: ["paragraph"],
      },
      {
        ul: [
          "Te restaurer",
          "Te reposer",
          "Te proposer pour filer un coup de main",
          "Te poser avec d'autres bénévoles pour faire connaissance",
        ],
        style: ["paragraph", "liteSpaceBetween"],
        margin: [75, 0, 50, 5],
      },
      {
        text: "Le Plan Bénévole",
        style: ["header"],
      },
      {
        image: join(__dirname, "../../../..", "/assets/volunteer_plan_qr.png"),
        fit: [300, 300],
        pageBreak: "after",
        style: {
          alignment: "center",
        },
      },
    ];
  }
}
