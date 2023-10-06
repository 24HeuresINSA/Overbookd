import { CreateTransferForm, TransferForm } from "./transfer.model"


export class Payor {

  private constructor(private readonly payor: number) {}

  static init(payor: number): Payor {
    return new Payor(payor)
  }

  transferTo(transferForm: CreateTransferForm): TransferForm {
    return {
      from: this.payor,
      ...transferForm
    }
  }
}
