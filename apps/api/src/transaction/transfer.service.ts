import { Injectable } from "@nestjs/common";
import {
  CreateTransferForm,
  Payor,
  Transfer,
} from "@overbookd/personal-account";
import { RequestHydratedUser } from "../authentication-zitadel/request-hydrated-user";

@Injectable()
export class TransferService {
  constructor(private readonly transfer: Transfer) {}

  async send(
    transfer: CreateTransferForm,
    payor: RequestHydratedUser,
  ): Promise<void> {
    const wantedTransfer = Payor.init(payor.id).transferTo(transfer);
    await this.transfer.send(wantedTransfer);
  }
}
