import { SignageType } from "./signage.js";

export type SignageForm = {
  name: string;
  type: SignageType;
};

export type SignageUpdateForm = SignageForm & {
  id: number;
};
