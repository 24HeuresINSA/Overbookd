export interface ConfigurationValue {
  value: any;
}

export class ConfigurationValueRepresentation implements ConfigurationValue {
  value: any;
}

export interface Configuration {
  key: string;
  value: any;
}

export class ConfigurationRepresentation implements Configuration {
  key: string;
  value: any;
}
