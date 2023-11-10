import { Configuration } from "@overbookd/configuration";
import { BarrelPrices } from "@overbookd/personal-account";
import { Configurations } from "../personal-account.service";
import { PrismaService } from "../../prisma.service";
import { JsonValue } from "@prisma/client/runtime/library";

function hasProperty(property: keyof BarrelPrices, value: object): boolean {
  return property in value;
}

function isBarrelPrices(value: JsonValue): value is BarrelPrices {
  if (typeof value !== "object") return false;

  const expectedProperties: (keyof BarrelPrices)[] = [
    "prixFutBlanche",
    "prixFutBlonde",
    "prixFutFlower",
    "prixFutTriple",
  ];

  return expectedProperties.every((property) => hasProperty(property, value));
}

export class PrismaConfigurations implements Configurations {
  constructor(private readonly prisma: PrismaService) {}

  async saveConfiguraton(
    prices: Configuration<BarrelPrices>,
  ): Promise<BarrelPrices> {
    const { value } = await this.prisma.configuration.upsert({
      where: { key: prices.key },
      create: prices,
      update: prices,
      select: { value: true },
    });

    if (!isBarrelPrices(value)) {
      throw new Error("Can't convert as barrel price");
    }

    return value;
  }
}
