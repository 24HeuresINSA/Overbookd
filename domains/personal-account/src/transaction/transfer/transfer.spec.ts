import { beforeEach, describe, expect, it } from "vitest";
import {
  InMemoryTransferRepository,
  MemberWithPermissions,
} from "./transfer-repository.inmemory";
import { Transaction } from "../transaction.model";
import { Transfer } from ".";
import { HAVE_PERSONAL_ACCOUNT } from "@overbookd/permission";
import {
  INSUFFICIENT_AMOUNT_ERROR_MESSAGE,
  NEGATIVE_AMOUNT_ERROR_MESSAGE,
  PAYEE_NOT_HAVE_PERSONAL_ACCOUNT_ERROR_MESSAGE,
  PAYOR_NOT_HAVE_PERSONAL_ACCOUNT_ERROR_MESSAGE,
  TRANSFER_TO_YOURSELF_ERROR_MESSAGE,
} from "./transfer.error";
import { Payor } from "./payor";

const lea: MemberWithPermissions = {
  id: 1,
  firstname: "Léa",
  lastname: "Mauyno",
  nickname: "Shogosse",
  balance: 0,
  permissions: [HAVE_PERSONAL_ACCOUNT],
};
const noel: MemberWithPermissions = {
  id: 2,
  firstname: "Noël",
  lastname: "Ertsemud",
  balance: 0,
  permissions: [HAVE_PERSONAL_ACCOUNT],
};
const tatouin: MemberWithPermissions = {
  id: 3,
  firstname: "Tatouin",
  lastname: "Jesoph",
  balance: 0,
  permissions: [HAVE_PERSONAL_ACCOUNT],
};
const neimad: MemberWithPermissions = {
  id: 4,
  firstname: "Neimad",
  lastname: "reaucar",
  balance: 0,
  permissions: [],
};
const adherents: MemberWithPermissions[] = [lea, noel, tatouin, neimad];

const transactions: Transaction[] = [];

describe("Transfer", () => {
  let transfer: Transfer;
  let transferRepository: InMemoryTransferRepository;

  describe("when member create transfer", () => {
    beforeEach(() => {
      transferRepository = new InMemoryTransferRepository(
        transactions,
        adherents,
      );
      transfer = new Transfer(transferRepository);
    });

    describe("when adherent try to transfer to himself", () => {
      const transferToSend = {
        to: lea.id,
        amount: 10,
        context: "Miam miam",
      };

      it("should indicate that adherent can't transfer to himself", async () => {
        const wantedTransfer = Payor.init(lea.id).transferTo(transferToSend);
        const sendTransfer = () => transfer.send(wantedTransfer);

        expect(sendTransfer).rejects.toThrow(
          TRANSFER_TO_YOURSELF_ERROR_MESSAGE,
        );
      });
    });

    describe("when adherent try to transfer negative amount", () => {
      const transferToSend = {
        to: noel.id,
        amount: -100,
        context: "Miam miam",
      };

      it("should indicate that the amount can't be negative", () => {
        const wantedTransfer = Payor.init(lea.id).transferTo(transferToSend);
        const sendTransfer = () => transfer.send(wantedTransfer);

        expect(sendTransfer).rejects.toThrow(NEGATIVE_AMOUNT_ERROR_MESSAGE);
      });
    });

    describe("when adherent try to transfer 0 cent", () => {
      const transferToSend = {
        to: noel.id,
        amount: 0,
        context: "Miam miam",
      };

      it("should indicate that the amount must be higher than 0", () => {
        const wantedTransfer = Payor.init(lea.id).transferTo(transferToSend);
        const sendTransfer = () => transfer.send(wantedTransfer);

        expect(sendTransfer).rejects.toThrow(INSUFFICIENT_AMOUNT_ERROR_MESSAGE);
      });
    });

    describe("when an adherent without personal account try to transfer", () => {
      const transferToSend = {
        to: lea.id,
        amount: 10,
        context: "Miam miam",
      };

      it("should indicate that adherent is not allowed to transfer", () => {
        const wantedTransfer = Payor.init(neimad.id).transferTo(transferToSend);
        const sendTransfer = () => transfer.send(wantedTransfer);

        expect(sendTransfer).rejects.toThrow(
          PAYOR_NOT_HAVE_PERSONAL_ACCOUNT_ERROR_MESSAGE,
        );
      });
    });

    describe("when adherent try to tranfer to adherent without personal account", () => {
      const transferToSend = {
        to: neimad.id,
        amount: 10,
        context: "Miam miam",
      };

      it("should indicate that payee is not allowed to receive transfer", () => {
        const wantedTransfer = Payor.init(noel.id).transferTo(transferToSend);
        const sendTransfer = () => transfer.send(wantedTransfer);

        expect(sendTransfer).rejects.toThrow(
          PAYEE_NOT_HAVE_PERSONAL_ACCOUNT_ERROR_MESSAGE,
        );
      });
    });

    describe("when allowed adherent try to valid transfer to an other adherent", () => {
      describe.each`
        from          | to            | amount  | expectedPayorBalance | expectedPayeeBalance
        ${lea.id}     | ${tatouin.id} | ${1000} | ${-1000}             | ${1000}
        ${tatouin.id} | ${noel.id}    | ${500}  | ${-500}              | ${500}
      `(
        "when adherent try to transfer $amount cents from #$from to #$to",
        ({ from, to, amount, expectedPayorBalance, expectedPayeeBalance }) => {
          const transferToSend = {
            to,
            amount,
            context: "Miam miam",
          };

          it(`should transfer ${amount} cents from #${from} to #${to}`, async () => {
            const wantedTransfer = Payor.init(from).transferTo(transferToSend);
            const { from: payor, to: payee } = await transfer.send(
              wantedTransfer,
            );

            expect(payor.id).toBe(from);
            expect(payee.id).toBe(to);

            const payorWithBalance = transferRepository.adherents.find(
              (adherent) => adherent.id === from,
            );
            const payeeWithBalance = transferRepository.adherents.find(
              (adherent) => adherent.id === to,
            );

            expect(payorWithBalance?.balance).toBe(expectedPayorBalance);
            expect(payeeWithBalance?.balance).toBe(expectedPayeeBalance);
          });
        },
      );
    });
  });
});
