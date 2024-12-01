import type { Gears } from "./gears";
import {
  InventoryImportContainer,
  type InventoryImportRaw,
} from "./inventory-import";
import { ManualInventoryRecord } from "./manual-inventory-record";
import { type Options, parse } from "csv-parse/browser/esm/sync";
import { SlugifyService } from "@overbookd/slugify";

export class CSVInventoryImportContainer extends InventoryImportContainer {
  private static readonly headerTranslation: Record<
    string,
    keyof InventoryImportRaw
  > = {
    code: "code",
    reference: "code",
    matos: "gear",
    materiel: "gear",
    nom: "gear",
    stockage: "storage",
    lieu: "storage",
    "lieu-de-stockage": "storage",
    quantite: "quantity",
    nombre: "quantity",
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
      cast: this.castNumbersWhenPossible,
    };
    try {
      const importRaws = parse(content, parseOptions) as InventoryImportRaw[];
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
      const transalte =
        CSVInventoryImportContainer.headerTranslation[
          SlugifyService.apply(column)
        ];
      if (!transalte) console.error(`Don't know column ${column}`);
      return transalte;
    });
  }

  private castNumbersWhenPossible(value: string) {
    const numeric = parseInt(value, 10);
    return isNaN(numeric) ? value : numeric;
  }
}
