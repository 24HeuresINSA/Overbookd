import { Injectable } from "@nestjs/common";
import {
  CreateTransferForm,
  Payor,
  Transfer,
} from "@overbookd/personal-account";
import { JwtPayload } from "../authentication/entities/jwt-util.entity";

@Injectable()
export class TransferService {
  constructor(private readonly transfer: Transfer) {}

  async send(transfer: CreateTransferForm, payor: JwtPayload): Promise<void> {
    const wantedTransfer = Payor.init(payor.id).transferTo(transfer);
    await this.transfer.send(wantedTransfer);
  }
}
