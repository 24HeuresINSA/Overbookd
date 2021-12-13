export interface Equipment {
  _id?: string;
  name: string;
  isValid?: boolean;
  amount: number;
  comment?: string;
  location: string;
  preciseLocation?: string;
  borrowed?: Array<any>;
  referencePicture?: string;
  referenceInvoice?: string;
  type: string;
  fromPool?: boolean;
  required?: {
    count: number;
    form: Array<any>;
  }; // Strictly front end variable
}

export interface EquipmentProposal extends Equipment {
  isNewEquipment: boolean;
  oldEquipment?: string;
  byUser: string;
}
