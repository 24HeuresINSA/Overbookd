import { beforeEach, describe, expect, it } from "vitest";
import {
  InMemoryTransferRepository,
  MemberWithPermission,
} from "./transfer-repository.inmemory";
import { Transaction } from "./transaction.model";
import { Transfer } from "./transfer";
import { HAVE_PERSONNAL_ACCOUNT } from "@overbookd/permission";
import {
  INSUFFICIENT_AMOUNT_ERROR_MESSAGE,
  NEGATIVE_AMOUNT_ERROR_MESSAGE,
  PAYEE_NOT_HAVE_PERSONAL_ACCOUNT_ERROR_MESSAGE,
  PAYOR_NOT_HAVE_PERSONAL_ACCOUNT_ERROR_MESSAGE,
  TRANSFER_TO_YOURSELF_ERROR_MESSAGE,
} from "./transfer.error";

const lea: MemberWithPermission = {
  id: 1,
  firstname: "Léa",
  lastname: "Mauyno",
  nickname: "Shogosse",
  balance: 0,
  permissions: [HAVE_PERSONNAL_ACCOUNT],
};
const noel: MemberWithPermission = {
  id: 2,
  firstname: "Noël",
  lastname: "Ertsemud",
  balance: 0,
  permissions: [HAVE_PERSONNAL_ACCOUNT],
};
const tatouin: MemberWithPermission = {
  id: 3,
  firstname: "Tatouin",
  lastname: "Jesoph",
  balance: 0,
  permissions: [HAVE_PERSONNAL_ACCOUNT],
};
const neimad: MemberWithPermission = {
  id: 4,
  firstname: "Neimad",
  lastname: "reaucar",
  balance: 0,
  permissions: [],
};
const adherents: MemberWithPermission[] = [lea, noel, tatouin, neimad];

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
      const transferToCreate = {
        to: lea.id,
        amount: 10,
        context: "Miam miam",
      };

      it("should indicate that adherent can't transfer to himself", async () => {
        expect(
          async () => await transfer.for(transferToCreate, lea.id),
        ).rejects.toThrow(TRANSFER_TO_YOURSELF_ERROR_MESSAGE);
      });
    });

    describe("when adherent try to transfer negative amount", () => {
      const transferToCreate = {
        to: lea.id,
        amount: -100,
        context: "Miam miam",
      };

      it("should indicate that the amount can't be negative", async () => {
        expect(
          async () => await transfer.for(transferToCreate, lea.id),
        ).rejects.toThrow(NEGATIVE_AMOUNT_ERROR_MESSAGE);
      });
    });

    describe("when adherent try to transfer 0 cent", () => {
      const transferToCreate = {
        to: lea.id,
        amount: 0,
        context: "Miam miam",
      };

      it("should indicate that the amount must be higher than 0", async () => {
        expect(
          async () => await transfer.for(transferToCreate, lea.id),
        ).rejects.toThrow(INSUFFICIENT_AMOUNT_ERROR_MESSAGE);
      });
    });

    describe("when not allowed adherent try to transfer", () => {
      const transferToCreate = {
        to: lea.id,
        amount: 10,
        context: "Miam miam",
      };

      it("should indicate that adherent is not allowed to transfer", async () => {
        expect(
          async () => await transfer.for(transferToCreate, neimad.id),
        ).rejects.toThrow(PAYOR_NOT_HAVE_PERSONAL_ACCOUNT_ERROR_MESSAGE);
      });
    });

    describe("when adherent try to tranfer to adherent without personal account", () => {
      const transferToCreate = {
        to: neimad.id,
        amount: 10,
        context: "Miam miam",
      };

      it("should indicate that payee is not allowed to receive transfer", async () => {
        expect(
          async () => await transfer.for(transferToCreate, neimad.id),
        ).rejects.toThrow(PAYEE_NOT_HAVE_PERSONAL_ACCOUNT_ERROR_MESSAGE);
      });
    });

    describe("when allowed adherent try to valid transfer to an other adherent", () => {
      describe.each`
        payor      | payee      | amount  | expectedPayorBalance | expectedPayeeBalance
        ${lea}     | ${tatouin} | ${1000} | ${-1000}             | ${1000}
        ${tatouin} | ${noel}    | ${500}  | ${-500}              | ${500}
      `(
        "when adherent try to transfer $amount cents from $from to $to",
        ({
          payor,
          payee,
          amount,
          expectedPayorBalance,
          expectedPayeeBalance,
        }) => {
          const transferToCreate = {
            to: payee.id,
            amount,
            context: "Miam miam",
          };

          it(`should transfer ${amount} cents from ${payor.firstname} to ${payee.firstname}`, async () => {
            const createdTransfer = await transfer.for(
              transferToCreate,
              payor.id,
            );

            expect(createdTransfer.amount).toBe(amount);
            expect(createdTransfer.to.id).toBe(payee.id);

            expect(payor.balance).toBe(expectedPayorBalance);
            expect(payee.balance).toBe(expectedPayeeBalance);
          });
        },
      );
    });
  });
});
