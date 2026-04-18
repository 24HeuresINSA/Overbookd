import type { Gears } from "./gears";
import {
  InventoryImportContainer,
  type InventoryImportRaw,
} from "./inventory-import";
import { ManualInventoryRecord } from "./manual-inventory-record";
import {
  type Options,
  type CastingContext,
  parse,
} from "csv-parse/browser/esm/sync";
import { SlugifyService } from "@overbookd/slugify";

const CODE = "code";
const GEAR = "gear";
const STORAGE = "storage";
const QUANTITY = "quantity";
const COMMENT = "comment";

export class CSVInventoryImportContainer extends InventoryImportContainer {
  private static readonly headerTranslation: Record<
    string,
    keyof InventoryImportRaw
  > = {
    code: CODE,
    reference: CODE,
    matos: GEAR,
    materiel: GEAR,
    nom: GEAR,
    stockage: STORAGE,
    lieu: STORAGE,
    "lieu-de-stockage": STORAGE,
    quantite: QUANTITY,
    nombre: QUANTITY,
    commentaire: COMMENT,
    commentaires: COMMENT,
    note: COMMENT,
    notes: COMMENT,
  };

  constructor(
    private readonly file: File,
    gearRepository: Gears,
  ) {
    super(gearRepository);
  }

  async extractManualRecords(): Promise<ManualInventoryRecord[]> {
    const content = await this.file.text();
    const delimiter = this.findDelimiter(content);
    const parseOptions: Options = {
      trim: true,
      skip_empty_lines: true,
      skip_records_with_empty_values: true,
      delimiter,
      columns: this.convertFileHeaderToRecordKeys,
      cast: this.castNumbersForQuantity,
    };

    try {
      const importRaws = parse(
        content,
        parseOptions,
      ) as unknown as InventoryImportRaw[];
      if (!this.checkRequiredColumns(importRaws)) {
        return [];
      }
      return this.convertImportRawsToManualRecords(importRaws);
    } catch (e) {
      console.error(e);
      sendFailureNotification("Erreur lors de l'importation du fichier CSV.");
      return [];
    }
  }

  private checkRequiredColumns(rows: InventoryImportRaw[]): boolean {
    const requiredColumns: (keyof InventoryImportRaw)[] = [
      CODE,
      STORAGE,
      QUANTITY,
    ];
    const firstRow = rows[0];
    const missingColumns = requiredColumns.filter(
      (column) => !(column in firstRow),
    );
    if (missingColumns.length > 0) {
      console.error(`Missing required columns: ${missingColumns.join(", ")}`);
      sendFailureNotification(
        `Colonnes requises manquantes: ${missingColumns.join(", ")}.`,
      );
      return false;
    }
    return true;
  }

  private findDelimiter(content: string): string {
    const delimiters = [",", ";"];
    const firstLine = content.split("\n")[0];
    const delimiterCounts = delimiters.map((delimiter) => ({
      delimiter,
      count: firstLine.split(delimiter).length - 1,
    }));
    delimiterCounts.sort((a, b) => b.count - a.count);
    return delimiterCounts[0].delimiter;
  }

  private convertFileHeaderToRecordKeys(
    header: string[],
  ): (keyof InventoryImportRaw)[] {
    return header.map((column) => {
      const translated =
        CSVInventoryImportContainer.headerTranslation[
          SlugifyService.apply(column)
        ];
      if (!translated) {
        console.error(`Don't know column ${column}`);
        return undefined as unknown as keyof InventoryImportRaw;
      }
      return translated;
    });
  }

  private castNumbersForQuantity(value: string, context: CastingContext) {
    if (context.column !== QUANTITY) return value;
    const numeric = parseInt(value, 10);
    return isNaN(numeric) ? value : numeric;
  }
}
