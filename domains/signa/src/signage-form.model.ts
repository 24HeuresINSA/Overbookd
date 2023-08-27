export interface SignageForm {
  name: string;
  category?: number;
}

export interface SignageSearchOptions {
  name?: string;
  category?: string;
}

export interface SignageUpdateForm extends SignageForm {
  id: number;
}
