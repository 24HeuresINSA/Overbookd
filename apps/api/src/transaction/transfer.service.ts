import { Injectable } from "@nestjs/common";
import { CreateTransferForm, Transfer } from "@overbookd/personal-account";
import { JwtPayload } from "../authentication/entities/jwt-util.entity";

@Injectable()
export class TransferService {
  constructor(private readonly transfer: Transfer) {}

  async send(transfer: CreateTransferForm, payor: JwtPayload): Promise<void> {
    const transferForm = {
      ...transfer,
      from: payor.id,
    };
    await this.transfer.send(transferForm);
  }
}
