import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryTransferRepository } from "./transfer-repository.inmemory";
import { HAVE_PERSONAL_ACCOUNT, Permission } from "@overbookd/permission";
import {
  INSUFFICIENT_AMOUNT_ERROR_MESSAGE,
  NEGATIVE_AMOUNT_ERROR_MESSAGE,
  PAYEE_NOT_HAVE_PERSONAL_ACCOUNT_ERROR_MESSAGE,
  PAYOR_NOT_HAVE_PERSONAL_ACCOUNT_ERROR_MESSAGE,
  TRANSFER_TO_YOURSELF_ERROR_MESSAGE,
} from "./transfer.error";
import { Payor } from "./payor";
import { InMemoryMemberRepository } from "./member-repository.inmemory";
import { Transfer } from "./transfer";

const lea = {
  id: 1,
  balance: 0,
  permissions: [HAVE_PERSONAL_ACCOUNT] as Permission[],
};
const noel = {
  id: 2,
  balance: 0,
  permissions: [HAVE_PERSONAL_ACCOUNT] as Permission[],
};
const tatouin = {
  id: 3,
  balance: 0,
  permissions: [HAVE_PERSONAL_ACCOUNT] as Permission[],
};
const neimad = {
  id: 4,
  balance: 0,
  permissions: [] as Permission[],
};
const adherents = [lea, noel, tatouin];

const members = [...adherents, neimad];

describe("Transfer", () => {
  let transfer: Transfer;
  let transferRepository: InMemoryTransferRepository;
  let memberRepository: InMemoryMemberRepository;

  describe("when member create transfer", () => {
    beforeEach(() => {
      transferRepository = new InMemoryTransferRepository(adherents);
      memberRepository = new InMemoryMemberRepository(members);
      transfer = new Transfer(transferRepository, memberRepository);
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

    describe("when allowed adherent try to transfer to an other adherent", () => {
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
            const { from: payor, to: payee } =
              await transfer.send(wantedTransfer);

            expect(payor.id).toBe(from);
            expect(payee.id).toBe(to);

            expect(payor.balance).toBe(expectedPayorBalance);
            expect(payee.balance).toBe(expectedPayeeBalance);
          });
        },
      );
    });

    describe("when adherent transfers multiple times", () => {
      it("should be debited from all the transfer amounts", async () => {
        const transferToSend = {
          to: tatouin.id,
          amount: 100,
          context: "Miam miam",
        };
        const transferToTatouin = Payor.init(lea.id).transferTo(transferToSend);
        await transfer.send(transferToTatouin);

        const transferToNoel = Payor.init(lea.id).transferTo({
          ...transferToSend,
          to: noel.id,
        });
        const { from } = await transfer.send(transferToNoel);

        expect(from.balance).toBe(-200);
      });
    });

    describe("when adherent receives multiple transfers", () => {
      it("should be credited from all the transfer amounts", async () => {
        const transferToSend = {
          to: tatouin.id,
          amount: 100,
          context: "Miam miam",
        };
        const transferFromLea = Payor.init(lea.id).transferTo(transferToSend);
        await transfer.send(transferFromLea);

        const transferFromNoel = Payor.init(noel.id).transferTo(transferToSend);
        const { to } = await transfer.send(transferFromNoel);

        expect(to.balance).toBe(200);
      });
    });
  });
});
