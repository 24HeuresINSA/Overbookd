import { SignageType } from "./signage";

export type SignageForm = {
  name: string;
  type: SignageType;
};

export type SignageUpdateForm = SignageForm & {
  id: number;
};
