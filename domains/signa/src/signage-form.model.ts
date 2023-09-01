import { SignageType } from "./signage";

export interface SignageForm {
  name: string;
  type: SignageType;
}

export interface SignageSearchOptions {
  name?: string;
  type?: SignageType;
}

export interface SignageUpdateForm extends SignageForm {
  id: number;
}
