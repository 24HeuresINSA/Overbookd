import { Configuration } from '@overbookd/configuration';

export interface ConfigurationValue {
  value: any;
}

export class ConfigurationValueRepresentation implements ConfigurationValue {
  value: any;
}

export class ConfigurationRepresentation implements Configuration {
  key: string;
  value: any;
}
