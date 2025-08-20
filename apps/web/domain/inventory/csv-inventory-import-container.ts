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
    const parseOptions: Options = {
      trim: true,
      skip_empty_lines: true,
      skip_records_with_empty_values: true,
      delimiter: ";",
      columns: this.convertFileHeaderToRecordKeys,
      cast: this.castNumbersForQuantity,
    };
    try {
      const importRaws = parse(
        content,
        parseOptions,
      ) as unknown as InventoryImportRaw[];
      return this.convertImportRawsToManualRecords(importRaws);
    } catch (e) {
      console.error(e);
      return [];
    }
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
        return "code";
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
