import { Schema, model } from "mongoose";

type ValueType = string | number | boolean | Date | { [key: string]: any };

export interface IConfig {
  key: string;
  value: string;
  description: string;
}

const ConfigSchema = new Schema<IConfig>(
  {
    key: { type: String, required: true },
    value: { type: Schema.Types.Mixed, required: true },
    description: { type: String, required: false },
  },
  { strict: false }
);

const ConfigModel = model<Config>("config", ConfigSchema);

class Config implements IConfig {
  constructor(
    public key: string,
    public value: any,
    public description: string
  ) {}
}

export default ConfigModel;
