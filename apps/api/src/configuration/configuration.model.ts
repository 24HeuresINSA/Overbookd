import { Prisma } from '@prisma/client';

export interface DatabaseConfiguration {
  key: string;
  value: Prisma.JsonValue;
}

export interface ConfigurationValue {
  value: object;
}

export class ConfigurationValueRepresentation implements ConfigurationValue {
  value: object;
}

export interface Configuration {
  key: string;
  value: object;
}

export class ConfigurationRepresentation implements Configuration {
  key: string;
  value: object;
}
