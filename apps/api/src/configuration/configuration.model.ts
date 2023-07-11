import { Prisma } from '@prisma/client';

export interface ConfigurationValue {
  value: Prisma.JsonValue;
}

export class ConfigurationValueRepresentation implements ConfigurationValue {
  value: Prisma.JsonValue;
}

export interface Configuration {
  key: string;
  value: Prisma.JsonValue;
}

export class ConfigurationRepresentation implements Configuration {
  key: string;
  value: Prisma.JsonValue;
}
