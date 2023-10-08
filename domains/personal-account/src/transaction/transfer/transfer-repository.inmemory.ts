import { updateItemToList } from "@overbookd/list";
import { TransferForm } from "./payor";
import { TransferRepository, TransferResponse } from "./transfer";

type Adherent = {
  id: number;
  balance: number;
}

export class InMemoryTransferRepository implements TransferRepository {
  constructor(private adherents: Adherent[]) {}

  create(transfer: TransferForm): Promise<TransferResponse> {
    const payor = this.adherents.find(
      (adherent) => adherent.id === transfer.from,
    );
    const payee = this.adherents.find(
      (adherent) => adherent.id === transfer.to,
    );

    if (!payor || !payee) throw new Error("Utilisateur introuvable");

    const updatedPayor = {
      ...payor,
      balance: payor.balance - transfer.amount,
    };
    const updatedPayee = {
      ...payee,
      balance: payee.balance + transfer.amount,
    };

    this.updateMemberToList(updatedPayor);
    this.updateMemberToList(updatedPayee);

    return Promise.resolve({
      from: updatedPayor,
      to: updatedPayee,
    });
  }

  private updateMemberToList(adherent: Adherent) {
    const index = this.adherents.findIndex((m) => m.id === adherent.id);
    this.adherents = updateItemToList(this.adherents, index, adherent);
  }
}
