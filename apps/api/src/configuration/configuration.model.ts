import { Configuration } from '@overbookd/configuration';

export interface ConfigurationValue {
  value: object | string | number | boolean;
}

export class ConfigurationValueRepresentation implements ConfigurationValue {
  value: object | string | number | boolean;
}

export class ConfigurationRepresentation implements Configuration {
  key: string;
  value: object | string | number | boolean;
}
