import { join } from "path";
import { Content } from "pdfmake/interfaces";

export class PurpleCocktail {
  static generatePage(): Content {
    return {
      image: join(__dirname, "../../../../..", "/assets/purple_cocktail.png"),
      fit: [700, 700],
      pageBreak: "after",
      style: {
        alignment: "center",
      },
    };
  }
}
