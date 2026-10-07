import { join } from "path";
import { Content } from "pdfmake/interfaces";

export class PurpleCocktail {
  private static ASSETS_DIR = join(__dirname, "../../../../..", "/assets");

  static generatePage(): Content {
    return {
      image: join(this.ASSETS_DIR, "/purple_cocktail.png"),
      fit: [700, 700],
      pageBreak: "after",
      style: {
        alignment: "center",
      },
    };
  }
}
